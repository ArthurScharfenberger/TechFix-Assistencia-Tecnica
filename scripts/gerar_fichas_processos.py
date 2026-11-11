"""Gera as fichas padrão de Processos (A11 a A14) a partir das fontes Markdown.

Uso: python scripts/gerar_fichas_processos.py A11 [A12 ...] [--sem-pdf]

O conteúdo da seção 2 vem da fonte Markdown de cada atividade; identificação,
decisões, pendências e declaração de IA vêm de scripts/fichas_processos.json.
O modelo institucional é preenchido sem alterar cabeçalho, seções ou textos fixos.
O PDF é exportado pelo Microsoft Word.
"""
import copy
import json
import re
import subprocess
import sys
from pathlib import Path

import docx
from docx.oxml.ns import qn
from docx.shared import Pt

RAIZ = Path(__file__).resolve().parent.parent
MODELO = RAIZ / "scripts" / "modelos" / "Documento_Padrao_Entrega_Atividades.docx"
CONFIG = RAIZ / "scripts" / "fichas_processos.json"
FONTE = "Inter Tight"
LARGURA_TABELA = 9645


def run(paragrafo, texto, negrito=False, italico=False, tamanho=None, mono=False):
    r = paragrafo.add_run(texto)
    r.font.name = "Consolas" if mono else FONTE
    if negrito:
        r.bold = True
    if italico:
        r.italic = True
    if tamanho:
        r.font.size = Pt(tamanho)
    return r


def inline(paragrafo, texto, tamanho=None, negrito_base=False):
    """Converte **negrito**, *itálico* e `código` em runs; links viram só o texto."""
    texto = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", texto)
    partes = re.split(r"(\*\*[^*]+\*\*|`[^`]+`|(?<![\w*])\*[^*\s][^*]*\*(?![\w*]))", texto)
    for parte in partes:
        if not parte:
            continue
        if parte.startswith("**") and parte.endswith("**"):
            run(paragrafo, parte[2:-2], negrito=True, tamanho=tamanho)
        elif parte.startswith("`") and parte.endswith("`"):
            run(paragrafo, parte[1:-1], tamanho=(tamanho or 10) - 0.5, mono=True)
        elif parte.startswith("*") and parte.endswith("*") and len(parte) > 2:
            run(paragrafo, parte[1:-1], italico=True, tamanho=tamanho, negrito=negrito_base)
        else:
            run(paragrafo, parte, tamanho=tamanho, negrito=negrito_base)


class Escritor:
    """Insere blocos antes de um parágrafo âncora do modelo."""

    def __init__(self, documento, ancora, tabela_modelo):
        self.doc = documento
        self.ancora = ancora
        self.tabela_modelo = tabela_modelo

    def paragrafo(self, estilo="normal"):
        p = self.ancora.insert_paragraph_before(style=estilo)
        return p

    def titulo(self, texto, nivel):
        p = self.paragrafo(f"Heading {nivel}")
        p.paragraph_format.keep_with_next = True
        inline(p, texto)
        return p

    def texto(self, texto, recuo=None, marcador=None, italico=False):
        p = self.paragrafo()
        if recuo is not None:
            p.paragraph_format.left_indent = Pt(recuo)
            p.paragraph_format.first_line_indent = Pt(-10)
        if marcador:
            run(p, marcador + " ")
        if italico:
            run(p, texto, italico=True)
        else:
            inline(p, texto)
        p.paragraph_format.space_after = Pt(4)
        return p

    @staticmethod
    def larguras(linhas, tamanho):
        """Garante a maior palavra de cada coluna e reparte o resto pelo volume de texto."""
        colunas = len(linhas[0])
        por_caractere = tamanho * 9  # largura média aproximada, em dxa
        minimo = []
        volume = []
        for i in range(colunas):
            textos = [re.sub(r"[*`]", "", linha[i]).replace("<br>", " ") for linha in linhas]
            maior = max((len(p) for t in textos for p in t.split()), default=4)
            # + margens internas da célula (cerca de 115 dxa de cada lado)
            minimo.append(max(min(maior, 11 if colunas >= 8 else 16) * por_caractere + 230, 560))
            volume.append(sum(len(t) for t in textos[1:]) / max(len(textos) - 1, 1) + 1)
        sobra = max(LARGURA_TABELA - sum(minimo), 0)
        larguras = [int(m + sobra * v / sum(volume)) for m, v in zip(minimo, volume)]
        if sum(larguras) > LARGURA_TABELA:
            larguras = [int(l * LARGURA_TABELA / sum(larguras)) for l in larguras]
        larguras[-1] = LARGURA_TABELA - sum(larguras[:-1])
        return larguras

    def tabela(self, linhas):
        colunas = len(linhas[0])
        tamanho = 9 if colunas <= 4 else (8 if colunas <= 6 else 7)
        tbl = self.doc.add_table(rows=len(linhas), cols=colunas)
        # Reaproveita bordas e propriedades da tabela do próprio modelo.
        tbl._tbl.remove(tbl._tbl.tblPr)
        tbl._tbl.insert(0, copy.deepcopy(self.tabela_modelo._tbl.tblPr))
        larguras = self.larguras(linhas, tamanho)
        grade = tbl._tbl.tblGrid
        for i, col in enumerate(grade.findall(qn("w:gridCol"))):
            col.set(qn("w:w"), str(larguras[i]))
        cabecalho_modelo = self.tabela_modelo.rows[0].cells[0]._tc.tcPr
        for i, linha in enumerate(linhas):
            row = tbl.rows[i]
            if i == 0:
                trPr = row._tr.get_or_add_trPr()
                h = trPr.makeelement(qn("w:tblHeader"), {qn("w:val"): "1"})
                trPr.append(h)
            for j, valor in enumerate(linha):
                cell = row.cells[j]
                cell.width = docx.shared.Twips(larguras[j])
                if i == 0:
                    tcPr = cell._tc.get_or_add_tcPr()
                    shd = copy.deepcopy(cabecalho_modelo.find(qn("w:shd")))
                    tcPr.append(shd)
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                for k, pedaco in enumerate(valor.split("<br>")):
                    if k:
                        p = cell.add_paragraph()
                        p.paragraph_format.space_after = Pt(0)
                    inline(p, pedaco.strip(), tamanho=tamanho, negrito_base=(i == 0))
        self.ancora._p.addprevious(tbl._tbl)
        self.paragrafo().paragraph_format.space_after = Pt(2)


def celulas(linha):
    linha = linha.strip().strip("|")
    return [c.strip().replace("\\|", "|") for c in re.split(r"(?<!\\)\|", linha)]


def escrever_markdown(escritor, texto):
    linhas = texto.splitlines()
    i = 0
    paragrafo = []

    def descarregar():
        if paragrafo:
            escritor.texto(" ".join(paragrafo))
            paragrafo.clear()

    while i < len(linhas):
        linha = linhas[i].rstrip()
        if not linha.strip() or linha.startswith("<!--"):
            descarregar()
            i += 1
            continue
        if linha.startswith("#"):
            descarregar()
            nivel = len(linha) - len(linha.lstrip("#"))
            escritor.titulo(linha.lstrip("#").strip(), min(nivel, 4))
            i += 1
            continue
        if linha.startswith("|"):
            descarregar()
            bloco = []
            while i < len(linhas) and linhas[i].startswith("|"):
                if not re.match(r"^\|\s*:?-{2,}", linhas[i]):
                    bloco.append(celulas(linhas[i]))
                i += 1
            escritor.tabela(bloco)
            continue
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", linha)
        if m:
            descarregar()
            recuo = 18 + len(m.group(1)) * 6
            marcador = "•" if m.group(2) in "-*" else m.group(2)
            escritor.texto(m.group(3), recuo=recuo, marcador=marcador)
            i += 1
            continue
        if linha.startswith(">"):
            descarregar()
            escritor.texto(linha.lstrip("> ").strip(), italico=False)
            i += 1
            continue
        paragrafo.append(linha.strip())
        i += 1
    descarregar()


def preencher_campo(paragrafo, valor):
    """Mantém o rótulo em negrito e troca a linha de preenchimento pelo valor."""
    rotulo = paragrafo.runs[0]
    for r in paragrafo.runs[1:]:
        r._r.getparent().remove(r._r)
    if not rotulo.text.endswith(" "):
        rotulo.text = rotulo.text + " "
    run(paragrafo, valor)


def gerar(chave, cfg, exportar_pdf=True):
    doc = docx.Document(MODELO)
    ps = doc.paragraphs
    tabela_ia = doc.tables[0]
    for p in ps:
        if p.style.name.startswith("Heading"):
            p.paragraph_format.keep_with_next = True

    titulo = ps[0]
    for r in titulo.runs[1:]:
        r._r.getparent().remove(r._r)
    titulo.runs[0].text = cfg["titulo"]

    for indice, campo in zip(range(3, 8), ["atividade", "etapa", "equipe", "integrantes", "data"]):
        preencher_campo(ps[indice], cfg[campo])

    ancora = ps[10]
    escritor = Escritor(doc, ancora, tabela_ia)
    fonte = (RAIZ / cfg["fonte"]).read_text(encoding="utf-8")
    fonte = re.sub(r"^# .*\n", "", fonte, count=1)
    fonte = re.split(r"\n<!-- fim-da-ficha -->", fonte)[0]
    p_repo = escritor.paragrafo()
    run(p_repo, "Repositório do projeto: ", negrito=True)
    run(p_repo, cfg["repositorio"])
    escrever_markdown(escritor, fonte)
    ancora._p.getparent().remove(ancora._p)

    preencher_campo(ps[13], cfg["decisoes"])
    preencher_campo(ps[14], cfg["pendencias"])

    ps[18].runs[0].text = ps[18].runs[0].text.replace("( )", "(X)", 1)
    for linha_cfg, row in zip(cfg["ia"], tabela_ia.rows[1:]):
        for valor, cell in zip(linha_cfg, row.cells):
            p = cell.paragraphs[0]
            inline(p, valor, tamanho=9)
    for row in list(tabela_ia.rows[1 + len(cfg["ia"]):]):
        row._tr.getparent().remove(row._tr)
    preencher_campo(ps[20], cfg["verificacao_ia"])
    preencher_campo(ps[21], cfg["responsavel_ia"])

    nomes = ["Arthur Scharfenberger: ", "Lucas Oliveira da Silva: "]
    for p, nome in zip(ps[25:27], nomes):
        p.runs[0].text = nome + p.runs[0].text
    ps[27]._p.getparent().remove(ps[27]._p)

    destino = RAIZ / cfg["saida"]
    destino.parent.mkdir(parents=True, exist_ok=True)
    doc.save(destino)
    print("DOCX:", destino.relative_to(RAIZ))
    if exportar_pdf:
        pdf = destino.with_suffix(".pdf")
        script = (
            "$w=New-Object -ComObject Word.Application; $w.Visible=$false; $w.DisplayAlerts=0;"
            f"$d=$w.Documents.Open('{destino}',$false,$true); $d.ExportAsFixedFormat('{pdf}',17);"
            "$d.Close(0); $w.Quit()"
        )
        subprocess.run(["powershell", "-NoProfile", "-Command", script], check=True, timeout=180)
        print("PDF:", pdf.relative_to(RAIZ))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    configuracao = json.loads(CONFIG.read_text(encoding="utf-8"))
    for chave in args or configuracao:
        gerar(chave, configuracao[chave], "--sem-pdf" not in sys.argv)


if __name__ == "__main__":
    main()
