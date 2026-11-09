"""Ficha A12 no padrão de cinco seções utilizado na entrega anterior."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, PageBreak, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

OUT = Path(__file__).resolve().parent/'Ficha_Padrao_Entrega_Atividade_12_Final.pdf'
REPO = 'https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica'
BASE = REPO+'/blob/v12/'
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='ArialBold', italic='Arial', boldItalic='ArialBold')
styles = getSampleStyleSheet()
for name, size, leading, font in [('Body12', 10, 14, 'Arial'), ('Head12', 12, 17, 'ArialBold'),
                                 ('Title12', 17, 22, 'ArialBold'), ('Small12', 9, 12, 'Arial')]:
    styles.add(ParagraphStyle(name=name, fontName=font, fontSize=size, leading=leading, spaceAfter=8))
story = []


def p(text, style='Body12'):
    story.append(Paragraph(text, styles[style]))


def h(text):
    story.append(Spacer(1, 5))
    p(text, 'Head12')


def link(label, path):
    return f'<link href="{BASE+path}" color="#155e91">{label}</link>'


p('Entrega de Atividade Semanal', 'Title12')
p('Atividade 12 - Arquitetura e repositório', 'Head12')
p('Ficha padrão de entrega - versão final e única', 'Small12')
h('1. Identificação')
p('<b>Projeto:</b> TechFix - Sistema de Assistência Técnica.<br/>'
  '<b>Integrantes:</b> Arthur Scharfenberger e Lucas Oliveira da Silva.<br/>'
  '<b>Disciplina:</b> Fundamentos de Programação Orientada a Objetos - ADS / ULBRA.<br/>'
  '<b>Professora:</b> Caroline. <b>Data de preparação:</b> 09/11/2026.<br/>'
  '<b>Prazo informado:</b> primeiros 30 minutos do Encontro 13 (09/11).<br/>'
  '<b>Base:</b> tag v11, mesmo repositório. <b>Versão de entrega:</b> tag v12.')
p(f'<b>Link para entrega:</b><br/><link href="{REPO}/tree/v12" color="#155e91">{REPO}/tree/v12</link>', 'Small12')
h('2. Conteúdo da atividade')
rows = [
    ['Critério', 'Implementação e evidência'],
    ['Pacotes', 'com.techfix.dominio, com.techfix.repositorio e com.techfix.app. O domínio não importa implementações de repositório.'],
    ['Contrato e registro', 'RepositorioOrdens define salvar(RegistroOrdem) e listar(). RegistroOrdem guarda número, cliente, equipamento, status e total, sem entidades com comportamento.'],
    ['Duas implementações', 'RepositorioOrdensEmMemoria usa uma lista. RepositorioOrdensEmArquivo usa texto TSV em UTF-8 com java.nio.file; erros viram UncheckedIOException com mensagem e causa.'],
    ['Injeção por construtor', 'ServicoOrdens recebe RepositorioOrdens. Main escolhe a implementação em arquivo em um único ponto da aplicação.'],
    ['Testes', '12 testes novos: serviço com memória, recuperação por nova instância com @TempDir, duplicidade, imutabilidade e falhas. Os 19 testes anteriores permanecem.'],
    ['UML e execução', link('UML atualizado', 'docs/uml.png')+'; '+link('imagem de duas execuções', 'docs/atividade-12/terminal-v12.png')+'; '+link('saída real', 'docs/atividade-12/saida-terminal-v12.txt')+'. Evidências também no README.'],
]
table = Table([[Paragraph(c, styles['Small12']) for c in row] for row in rows], colWidths=[105, 394])
table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eeeeee')),
    ('GRID', (0, 0), (-1, -1), .5, colors.HexColor('#aaaaaa')), ('LEFTPADDING', (0, 0), (-1, -1), 7),
    ('RIGHTPADDING', (0, 0), (-1, -1), 7), ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
story.append(table)
story.append(Spacer(1, 10))
p('<b>Regra preservada em cada registro:</b> total na conclusão = diagnóstico de R$ 80,00 para notebook ou R$ 60,00 para desktop + itens adicionais.')
story.append(PageBreak())
h('3. Decisões, validação e pendências')
p('<b>Decisões:</b> o contrato pertence ao domínio; as implementações dependem dele. ServicoOrdens coordena a conclusão, exige uma ordem em atendimento, rejeita número já registrado e muda o status somente depois de salvar. RegistroOrdem é uma fotografia imutável dos dados da conclusão.')
p('<b>Validação realizada em 09/11/2026:</b> Temurin OpenJDK 25.0.5 e Maven 3.9.16. <b>31 testes executados, zero falhas, zero erros e zero ignorados.</b> As duas JVMs demonstraram histórico de 0 para 1 e depois de 1 para 2; a OS 1 permanece na segunda execução. A imagem foi composta a partir da saída real dos processos.')
p('<b>Comandos na raiz do projeto (JDK 25):</b><br/>'
  'mvn -B -f backend/pom.xml clean test<br/>'
  'java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv<br/>'
  'java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv', 'Small12')
p('<b>Limites:</b> exemplo local, para um processo por vez; não há transações ou recuperação de gravações parciais. O histórico não reconstrói todos os itens da ordem. Arquivo inexistente inicia vazio; demais falhas são propagadas. Os commits registram incrementos reais desta preparação, sem simular datas passadas.')
p('<b>Pendências humanas:</b> revisar e compreender os arquivos, confirmar responsabilidade e autoria, enviar a ficha e o link da tag v12 na plataforma Aula. Esta ficha não atesta submissão nem microdefesa já realizada.')
p('Apoio à revisão: '+link('decisões e testes', 'docs/atividade-12/README.md')+'; '+link('guia de microdefesa', 'docs/atividade-12/microdefesa.md')+'; '+link('resultado dos testes', 'docs/atividade-12/resultado-testes.txt')+'.', 'Small12')
h('4. Declaração de uso de Inteligência Artificial')
p('(X) A equipe utilizou ferramenta de IA nesta atividade.<br/>( ) A equipe não utilizou ferramenta de IA nesta atividade.')
p('<b>Ferramenta:</b> OpenAI Codex.<br/><b>Uso nesta preparação:</b> implementação dos pacotes, serviço, registro e repositórios; criação e execução dos testes; preparação e revisão da documentação, UML e evidências. A compreensão e a revisão humana continuam sob responsabilidade da equipe.')
h('5. Responsabilidade e autoria')
p('Declaração para confirmação no ato da entrega: ao submeter esta ficha, os integrantes confirmam que leram e compreenderam o conteúdo e assumem responsabilidade pela correção e coerência, inclusive pelas partes desenvolvidas com apoio de IA.')
story.append(Spacer(1, 10))
p('Arthur Scharfenberger - assinatura: __________________________________<br/><br/>'
  'Lucas Oliveira da Silva - assinatura: __________________________________<br/><br/>'
  'Data da confirmação: ______ / ______ / __________', 'Small12')


def footer(canvas, doc):
    canvas.setFont('Arial', 8)
    canvas.setFillColor(colors.HexColor('#555555'))
    canvas.drawString(48, 25, 'TechFix | Atividade 12 | Entrega final | 09/11/2026')
    canvas.drawRightString(A4[0]-48, 25, str(doc.page))


SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=48, rightMargin=48, topMargin=38, bottomMargin=43,
    title='Ficha de Entrega - Atividade 12 - TechFix', author='TechFix').build(story, onFirstPage=footer, onLaterPages=footer)
reader = PdfReader(OUT)
assert len(reader.pages) == 2, len(reader.pages)
assert '5. Responsabilidade e autoria' in reader.pages[1].extract_text()
print(f'Ficha criada: {len(reader.pages)} páginas.')
