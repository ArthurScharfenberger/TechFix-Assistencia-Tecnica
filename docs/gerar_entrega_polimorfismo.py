"""Gera somente a ficha PDF final da A9 a partir da fonte Markdown.

Requer reportlab. Execute: python docs/gerar_entrega_polimorfismo.py
"""
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Preformatted, Spacer, PageBreak

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'atividade-semanal-09-poo-entrega-final.md'
OUTPUT = ROOT / 'Ficha_Padrao_Entrega_Atividade_09_Final.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyFinal', fontName='Helvetica', fontSize=10.5,
                         leading=15, spaceAfter=9, alignment=TA_LEFT))
styles['Title'].fontName = 'Helvetica-Bold'
styles['Title'].fontSize = 21
styles['Title'].leading = 25
styles['Title'].textColor = colors.black
styles['Heading1'].fontSize = 15
styles['Heading1'].leading = 19
styles['Heading2'].fontSize = 12
styles['Heading2'].leading = 16
styles['Code'].fontSize = 8
styles['Code'].leading = 11
story = []
for block in SOURCE.read_text(encoding='utf-8').split('\n\n'):
    if block.startswith('```'):
        story.append(Preformatted('\n'.join(block.splitlines()[1:-1]), styles['Code']))
        story.append(Spacer(1, 9))
    elif block.strip() == '<!-- page -->':
        story.append(PageBreak())
    elif block.startswith('# '):
        story.append(Paragraph(escape(block[2:]), styles['Title']))
    elif block.startswith('## '):
        story.append(Paragraph(escape(block[3:]), styles['Heading1']))
    elif block.startswith('### '):
        story.append(Paragraph(escape(block[4:]), styles['Heading2']))
    elif block.startswith('- '):
        for line in block.splitlines():
            story.append(Paragraph(escape(line[2:]), styles['BodyFinal'], bulletText='-'))
    elif block.strip():
        story.append(Paragraph(escape(block), styles['BodyFinal']))

def footer(canvas, doc):
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#555555'))
    canvas.drawString(44, 27, 'TechFix | A9 | Entrega final | 04/10/2026')
    canvas.drawRightString(A4[0] - 44, 27, str(doc.page))

SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
                  topMargin=38, bottomMargin=43,
                  title='A9 Comportamento polimórfico - Entrega final',
                  author='Equipe TechFix').build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
