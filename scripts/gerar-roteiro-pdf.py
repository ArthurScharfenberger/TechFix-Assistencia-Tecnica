from pathlib import Path
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, Table, TableStyle, Preformatted, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
import pymupdf

source=Path('docs/Roteiro-Apresentacao-POO-Arthur-Lucas.md')
output=source.with_suffix('.pdf')
text=source.read_text(encoding='utf-8').replace('—','-').replace('–','-')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='ScriptBody',fontName='Helvetica',fontSize=10.5,leading=14,spaceAfter=8))
styles.add(ParagraphStyle(name='ScriptCode',fontName='Courier',fontSize=9.5,leading=14,spaceAfter=10))
styles.add(ParagraphStyle(name='ScriptTime',fontName='Helvetica',fontSize=9,leading=12,textColor=colors.HexColor('#555555'),spaceAfter=7))
styles['Title'].fontName='Helvetica-Bold';styles['Title'].fontSize=20;styles['Title'].leading=24;styles['Title'].spaceAfter=14
styles['Heading2'].fontName='Helvetica-Bold';styles['Heading2'].fontSize=14;styles['Heading2'].leading=18;styles['Heading2'].textColor=colors.black
styles['Heading3'].fontName='Helvetica-Bold';styles['Heading3'].fontSize=12;styles['Heading3'].leading=16;styles['Heading3'].textColor=colors.black
story=[];pending=[]
def flush():
    if pending: story.append(KeepTogether(pending.copy()));pending.clear()
for block in text.split('\n\n'):
    if block.startswith('# '): story.append(Paragraph(escape(block[2:]),styles['Title']))
    elif block.startswith('## '):
        flush()
        if block.startswith('## Arthur - slides') or block.startswith('## Controle do tempo'): story.append(PageBreak())
        story.append(Paragraph(escape(block[3:]),styles['Heading2']))
    elif block.startswith('### '):
        flush();pending.append(Paragraph(escape(block[4:]),styles['Heading3']))
    elif block.startswith('Tempo reservado:'): pending.append(Paragraph(escape(block),styles['ScriptTime']))
    elif block.startswith('| '):
        flush(); rows=[[Paragraph(escape(c.strip()),styles['ScriptTime']) for c in line.strip('|').split('|')] for line in block.splitlines() if not set(line.replace('|','').replace(' ','')).issubset({'-'})]
        table=Table(rows,colWidths=[90,165,244],repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#EEEEEE')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),0.6,colors.grey),('LINEBELOW',(0,1),(-1,-1),0.3,colors.HexColor('#CCCCCC')),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        story.extend([table,Spacer(1,12)])
    elif block.startswith('```'):
        flush();story.append(Preformatted('\n'.join(block.splitlines()[1:-1]),styles['ScriptCode']))
    elif block.strip():
        p=Paragraph(escape(block),styles['ScriptBody'])
        if pending: pending.append(p);flush()
        else: story.append(p)
flush()
def footer(canvas,doc):
    canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#555555'))
    canvas.drawString(48,25,'TechFix | Roteiro de apresentação | Arthur e Lucas')
    canvas.drawRightString(A4[0]-48,25,str(doc.page))
SimpleDocTemplate(str(output),pagesize=A4,leftMargin=48,rightMargin=48,topMargin=40,bottomMargin=44,title='Roteiro de apresentação do TechFix',author='Arthur Scharfenberger e Lucas Oliveira da Silva').build(story,onFirstPage=footer,onLaterPages=footer)
pdf=pymupdf.open(output);render=Path('tmp/roteiro-pdf-qa');render.mkdir(exist_ok=True)
for i,page in enumerate(pdf): page.get_pixmap(matrix=pymupdf.Matrix(1,1)).save(render/f'pagina-{i+1}.png')
extracted=' '.join(page.get_text() for page in pdf)
for i in range(1,11): assert f'Slide {i} -' in extracted
print(f'PDF gerado: {output}; páginas: {len(pdf)}; dez slides presentes.')
