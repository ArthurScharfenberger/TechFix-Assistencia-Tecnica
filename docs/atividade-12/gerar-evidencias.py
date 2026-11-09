"""Gera UML PNG/SVG, saída de duas JVMs e resumo dos relatórios reais do JUnit.

Execute após mvn clean test. Requer Pillow; JAVA_HOME deve apontar ao JDK 25.
A demonstração usa uma pasta temporária nova, sem apagar históricos do usuário.
"""
from pathlib import Path
from html import escape
import math
import os
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/atividade-12'
FONT_DIR = Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts'
FONT = ImageFont.truetype(str(FONT_DIR / 'arial.ttf'), 23)
SMALL = ImageFont.truetype(str(FONT_DIR / 'arial.ttf'), 20)
BOLD = ImageFont.truetype(str(FONT_DIR / 'arialbd.ttf'), 26)
INK = '#172b40'
im = Image.new('RGB', (2000, 1490), 'white')
d = ImageDraw.Draw(im)
svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="1490" viewBox="0 0 2000 1490">',
       '<rect width="100%" height="100%" fill="white"/>']


def text(x, y, value, bold=False, small=False):
    font = BOLD if bold else SMALL if small else FONT
    d.text((x, y), value, font=font, fill=INK)
    svg.append(f'<text x="{x}" y="{y + font.size}" font-family="Arial" font-size="{font.size}" '
               f'font-weight="{"bold" if bold else "normal"}" fill="{INK}">{escape(value)}</text>')


def rect(x, y, w, h, fill):
    d.rectangle((x, y, x+w, y+h), fill=fill, outline=INK, width=2)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{INK}" stroke-width="2"/>')


def line(points, dashed=False):
    for a, b in zip(points, points[1:]):
        length = math.dist(a, b)
        if dashed:
            for i in range(0, int(length), 14):
                def p(t):
                    return (a[0]+(b[0]-a[0])*t/length, a[1]+(b[1]-a[1])*t/length)
                d.line([p(i), p(min(i+8, length))], fill=INK, width=2)
        else:
            d.line([a, b], fill=INK, width=2)
    coords = ' '.join(f'{x},{y}' for x, y in points)
    svg.append(f'<polyline points="{coords}" fill="none" stroke="{INK}" stroke-width="2"'
               + (' stroke-dasharray="8 6"' if dashed else '') + '/>')


def arrow(points, realization=False):
    line(points, True)
    a, b = points[-2:]
    angle = math.atan2(b[1]-a[1], b[0]-a[0])
    sides = [(b[0]-20*math.cos(angle)+s*10*math.sin(angle),
              b[1]-20*math.sin(angle)-s*10*math.cos(angle)) for s in [-1, 1]]
    if realization:
        shape = [b, *sides]
        d.polygon(shape, fill='white', outline=INK, width=2)
        svg.append('<polygon points="'+' '.join(f'{x},{y}' for x, y in shape)
                   + f'" fill="white" stroke="{INK}" stroke-width="2"/>')
    else:
        line([sides[0], b, sides[1]])


def box(x, y, w, title, rows):
    h = 65 + 32*len(rows)
    rect(x, y, w, h, 'white')
    text(x+15, y+12, title, bold=True)
    line([(x, y+52), (x+w, y+52)])
    for i, row in enumerate(rows):
        text(x+15, y+63+32*i, row, small=True)
    return h


text(40, 20, 'TechFix | Atividade 12 | Arquitetura e persistência', bold=True)
for y, h, label, color in [(90, 210, 'com.techfix.app', '#eef6fc'),
                          (350, 670, 'com.techfix.dominio', '#eff9f4'),
                          (1080, 290, 'com.techfix.repositorio', '#fff7e9')]:
    rect(40, y, 1920, h, color)
    text(60, y+12, '«package» ' + label, bold=True)
box(710, 145, 530, 'Main', ['+ main(args: String[]): void', 'Escolhe arquivo e injeta a interface'])
box(90, 425, 500, 'ServicoOrdens', ['- repositorio: RepositorioOrdens', '+ ServicoOrdens(repositorio)',
    '+ concluir(ordem): RegistroOrdem', '+ listar(): List<RegistroOrdem>', '+ proximoNumero(): int'])
box(710, 425, 530, '«interface» RepositorioOrdens', ['+ salvar(registro: RegistroOrdem): void', '+ listar(): List<RegistroOrdem>'])
box(90, 745, 500, 'OrdemServico', ['- status: StatusOrdemServico', '+ calcularTotal(): BigDecimal',
    '+ alterarStatus(status): void', '+ getNumero() / getNomeCliente()', '+ getTipoEquipamento()'])
box(1360, 745, 510, '«record» RegistroOrdem', ['numero: int', 'cliente: String',
    'equipamento: TipoEquipamento', 'status: StatusOrdemServico', 'total: BigDecimal'])
box(370, 1150, 640, 'RepositorioOrdensEmMemoria', ['- registros: List<RegistroOrdem>',
    '+ salvar(registro): void', '+ listar(): List<RegistroOrdem>'])
box(1210, 1150, 650, 'RepositorioOrdensEmArquivo', ['- arquivo: Path',
    '+ salvar(registro): void', '+ listar(): List<RegistroOrdem>'])
arrow([(710, 220), (530, 220), (530, 425)])
text(550, 315, 'cria e injeta', small=True)
arrow([(590, 500), (710, 500)])
text(602, 465, 'usa', small=True)
arrow([(340, 650), (340, 745)])
text(355, 680, 'conclui', small=True)
arrow([(1240, 480), (1630, 480), (1630, 745)])
text(1380, 443, 'salva / lista dados', small=True)
arrow([(590, 620), (1460, 620), (1460, 745)])
text(1030, 630, 'cria registro', small=True)
arrow([(690, 1150), (690, 1050), (1290, 1050), (1290, 575), (1000, 575), (1000, 554)], True)
line([(1535, 1150), (1535, 1050), (1290, 1050)], True)
text(740, 1060, 'realizam o contrato', small=True)
arrow([(1240, 220), (1910, 220), (1910, 1240), (1860, 1240)])
text(1350, 185, 'cria implementação concreta', small=True)
text(710, 775, 'Modelo anterior mantido no domínio:', small=True)
for i, value in enumerate(['Cliente, Tecnico, Equipamento, Notebook, Desktop,',
    'RoteiroDiagnostico, PoliticaCobranca, PoliticasCobranca,',
    'CobrancaNotebook, CobrancaDesktop e os dois enums.',
    'As relações internas desse modelo estão no UML da A11.']):
    text(710, 812+32*i, value, small=True)
text(40, 1400, 'Seta tracejada: dependência. Triângulo vazio tracejado: realização de interface.', small=True)
text(40, 1435, 'Recorte da A12: app → domínio e repositório; repositório → domínio. Domínio não importa implementações.', small=True)
im.save(ROOT/'docs/uml.png')
(ROOT/'docs/uml.svg').write_text('\n'.join(svg+['</svg>']), encoding='utf-8')

java = str(Path(os.environ['JAVA_HOME'])/'bin/java.exe') if os.environ.get('JAVA_HOME') else 'java'
command = [java, '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-cp',
           str(ROOT/'backend/target/classes'), 'com.techfix.app.Main', 'dados/ordens.tsv']
shown = '> java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv'
with tempfile.TemporaryDirectory(prefix='techfix-v12-') as directory:
    outputs = [subprocess.check_output(command, cwd=directory).decode('utf-8').replace('\r\n', '\n') for _ in range(2)]
assert 'Registros antes: 0' in outputs[0] and 'Registros depois: 1' in outputs[0]
assert 'Registros antes: 1' in outputs[1] and 'Registros depois: 2' in outputs[1]
assert 'OS 1 | João Silva' in outputs[1] and 'OS 2 | João Silva' in outputs[1]
transcript = '\n\n'.join(f'EXECUCAO {i+1}\n{shown}\n{out.rstrip()}' for i, out in enumerate(outputs))+'\n'
(OUT/'saida-terminal-v12.txt').write_text(transcript, encoding='utf-8')
mono = ImageFont.truetype(str(FONT_DIR/'consola.ttf'), 21)
lines = transcript.splitlines()
terminal = Image.new('RGB', (max(int(mono.getlength(s)) for s in lines)+64, len(lines)*30+60), '#101827')
draw = ImageDraw.Draw(terminal)
for i, value in enumerate(lines):
    draw.text((28, 25+i*30), value, font=mono, fill='#9ae6b4' if value.startswith(('>', 'EXECUCAO')) else '#e2e8f0')
terminal.save(OUT/'terminal-v12.png')

totals = [0, 0, 0, 0]
report = ['Testes reais | Maven Surefire | Atividade 12']
for path in sorted((ROOT/'backend/target/surefire-reports').glob('TEST-*.xml')):
    suite = ET.parse(path).getroot()
    counts = [int(suite.get(k)) for k in ['tests', 'failures', 'errors', 'skipped']]
    totals = [a+b for a, b in zip(totals, counts)]
    report.append(f'{suite.get("name")}: {counts[0]} testes; falhas={counts[1]}, erros={counts[2]}, ignorados={counts[3]}')
assert totals == [31, 0, 0, 0], totals
report.append(f'TOTAL: {totals[0]} testes; falhas={totals[1]}, erros={totals[2]}, ignorados={totals[3]}')
(OUT/'resultado-testes.txt').write_text('\n'.join(report)+'\n', encoding='utf-8')
print(transcript)
print(report[-1])
