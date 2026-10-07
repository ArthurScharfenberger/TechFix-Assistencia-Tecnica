"""Exporta as fontes A8/A10 para PDF com ReportLab; requer reportlab e svglib."""
from pathlib import Path
from html import escape
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from svglib.svglib import svg2rlg

BASE = Path(__file__).resolve().parent / 'entregas-processos'
pdfmetrics.registerFont(TTFont('TechFixBody', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('TechFixBold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('TechFixBody', normal='TechFixBody', bold='TechFixBold')
BODY = ParagraphStyle('body', fontName='TechFixBody', fontSize=10, leading=14, spaceAfter=7, alignment=TA_LEFT, allowWidows=0, allowOrphans=0)
TITLE = ParagraphStyle('title', parent=BODY, fontName='TechFixBold', fontSize=16, leading=20, spaceAfter=13)
HEADING = ParagraphStyle('heading', parent=BODY, fontName='TechFixBold', fontSize=12, leading=16, spaceBefore=10, spaceAfter=7, keepWithNext=True)
CELL = ParagraphStyle('cell', parent=BODY, fontSize=8.5, leading=11, spaceAfter=0)
WIDTH = A4[0] - 108


def clean(text):
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    return escape(text.replace('**', '').replace('`', ''))


def table(lines):
    rows = [[part.strip() for part in line.strip('|').split('|')]
            for line in lines if not re.fullmatch(r'\|[\s:|\-]+\|', line)]
    count = len(rows[0])
    if any(len(row) != count for row in rows):
        raise ValueError('Tabela Markdown irregular')
    widths = {2: [0.37, 0.63], 3: [0.27, 0.25, 0.48], 4: [0.21, 0.18, 0.38, 0.23], 5: [0.15, 0.24, 0.15, 0.22, 0.24]}[count]
    overrides = {
        'Requisito': [0.14, 0.18, 0.68],
        'Tamanho': [0.11, 0.48, 0.41],
        'Ordem / ID': [0.11, 0.25, 0.15, 0.13, 0.36],
        'Incremento / itens': [0.25, 0.37, 0.38],
        'Data e ferramenta': [0.17, 0.22, 0.29, 0.32],
        'Probabilidade / Impacto': [0.31, 0.23, 0.23, 0.23],
        'Componente': [0.24, 0.40, 0.36],
        'Elemento da A7': [0.23, 0.47, 0.30],
        'Cenário': [0.28, 0.47, 0.25],
        'Pessoa': [0.23, 0.24, 0.53],
        'Característica do TechFix': [0.25, 0.29, 0.46],
        'Momento': [0.22, 0.36, 0.42],
        'Estado': [0.23, 0.25, 0.52],
        'Esboço': [0.28, 0.45, 0.27],
        'Artefato e fonte': [0.30, 0.27, 0.43],
        'No esboço Arquitetura-Rastreabilidade-Esboco.md': [0.30, 0.43, 0.27],
    }
    widths = overrides.get(rows[0][0], widths)
    if rows[0][0] == 'Requisito da A5' and count == 5:
        widths = [0.17, 0.22, 0.15, 0.27, 0.19]
    data = [[Paragraph(('<b>' + clean(cell) + '</b>') if i == 0 else clean(cell), CELL)
             for cell in row] for i, row in enumerate(rows)]
    result = Table(data, colWidths=[WIDTH * n for n in widths], repeatRows=1, hAlign='LEFT')
    result.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), .4, colors.HexColor('#d9d9d9')),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e7e6e6')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return result


def page_header(canvas, doc):
    canvas.saveState()
    canvas.setFont('TechFixBody', 9)
    canvas.drawString(54, A4[1] - 30, 'ULBRA — Universidade Luterana do Brasil')
    canvas.drawString(54, A4[1] - 43, 'Disciplina: Processos de Engenharia de Software')
    canvas.setFont('TechFixBody', 8)
    canvas.drawRightString(A4[0] - 54, 30, str(doc.page))
    canvas.restoreState()


def build(source, output):
    lines = (BASE / source).read_text(encoding='utf-8').splitlines()
    story = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        if not line:
            continue
        if line.startswith('|'):
            block = [line]
            while i < len(lines) and lines[i].startswith('|'):
                block.append(lines[i]); i += 1
            story.extend([table(block), Spacer(1, 8)])
        elif line.startswith('!['):
            figure = svg2rlg(str(BASE / 'A10-Arquitetura.svg'))
            ratio = min(WIDTH, 430) / figure.width
            figure.scale(ratio, ratio)
            figure.width *= ratio
            figure.height *= ratio
            group = [figure, Spacer(1, 7)]
            while i < len(lines) and not lines[i].strip():
                i += 1
            if i < len(lines) and lines[i].startswith('Figura '):
                group.append(Paragraph(clean(lines[i]), BODY))
                i += 1
            story.append(KeepTogether(group))
        elif line.startswith('#'):
            heading = line.lstrip('#').strip()
            story.append(Paragraph(clean(heading), TITLE if line.startswith('# ') else HEADING))
        else:
            story.append(Paragraph(clean(line), BODY))
    path = BASE / output
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=54, leftMargin=54,
                            topMargin=65, bottomMargin=50, title=lines[0].lstrip('# ').strip(),
                            author='Arthur Scharfenberger e Lucas Oliveira da Silva')
    doc.build(story, onFirstPage=page_header, onLaterPages=page_header)
    print(path.name)


if __name__ == '__main__':
    build('A7-Processo-Esboco.md', 'A7-Processo-Esboco.pdf')
    build('A7-Processo-Entrega-Final.md', 'A7-Processo-Entrega-Final.pdf')
    build('A8-Entrega-Final-Revisada.md', 'A8-Entrega-Final.pdf')
    build('A10-Arquitetura-Rastreabilidade-Final.md', 'A10-Arquitetura-Rastreabilidade-Final.pdf')
