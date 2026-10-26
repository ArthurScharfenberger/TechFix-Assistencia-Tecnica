"""Ficha A11 no modelo institucional de cinco seções."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
import pypdfium2 as pdfium

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/atividade-11/Ficha_Padrao_Entrega_Atividade_11_Final.pdf'
REPO='https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica'
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyA11',fontName='Arial',fontSize=10.5,leading=15,spaceAfter=8))
styles.add(ParagraphStyle(name='HeadA11',fontName='ArialBold',fontSize=12,leading=17,spaceBefore=10,spaceAfter=8))
styles.add(ParagraphStyle(name='TitleA11',fontName='ArialBold',fontSize=17,leading=22,spaceAfter=9))
styles.add(ParagraphStyle(name='SmallA11',fontName='Arial',fontSize=9,leading=12,spaceAfter=4))
story=[]
def p(text,style='BodyA11'):
    story.append(Paragraph(text,styles[style]))
def h(text): p(text,'HeadA11')
def link(label,url): return f'<link href="{escape(url)}" color="#155e91">{escape(label)}</link>'
def table(rows,widths):
    data=[[Paragraph(c,styles['SmallA11']) for c in row] for row in rows]
    t=Table(data,colWidths=widths,hAlign='LEFT')
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#eeeeee')),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#a0a0a0')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    story.append(t)

p('Entrega de Atividade Semanal','TitleA11')
p('Atividade 11 - Reciclagem no próprio domínio','HeadA11')
p('Ficha padrão de entrega - versão final','SmallA11')
h('1. Identificação')
p('<b>Atividade:</b> A11 - Reciclagem no próprio domínio.<br/><b>Etapa:</b> atividade semanal, entrega final.<br/><b>Equipe e projeto:</b> TechFix - Sistema de Assistência Técnica.<br/><b>Integrantes:</b> Arthur Scharfenberger e Lucas Oliveira da Silva.<br/><b>Disciplina:</b> Fundamentos de Programação Orientada a Objetos - ADS / ULBRA.<br/><b>Professora:</b> Caroline.<br/><b>Data de preparação:</b> 26/10/2026.')
p('<b>Repositório GitHub:</b><br/>'+link(REPO,REPO))
p('<b>Versão do código:</b> '+link('tag v11',REPO+'/tree/v11')+'<br/><b>Ficha e documentação atualizadas:</b> '+link('docs/atividade-11 na branch main',REPO+'/tree/main/docs/atividade-11'))
h('2. Conteúdo da atividade')
p('O TechFix aplica os conceitos de herança, interface, polimorfismo e composição ao atendimento de notebooks e desktops. A ordem de serviço reúne cliente, equipamento, técnico opcional e itens de serviço, além de calcular o diagnóstico conforme o tipo do equipamento.')
p('<b>RN1.</b> Cada ordem pertence a um cliente, atende um equipamento, inicia aberta e pode ter zero ou um técnico responsável.<br/><b>RN2.</b> O diagnóstico de notebook custa R$ 80,00.<br/><b>RN3.</b> O diagnóstico de desktop custa R$ 60,00.<br/><b>RN4.</b> A ordem cria e guarda itens com descrição não vazia e valor não negativo, expondo uma cópia não modificável da lista.<br/><b>RN5.</b> O total soma o diagnóstico, calculado pela política escolhida na abertura, aos serviços adicionais.')
p('Mini-especificação: '+link('especificacao.md',REPO+'/blob/main/docs/atividade-11/especificacao.md')+'. Diagrama: '+link('uml.png',REPO+'/blob/main/docs/atividade-11/uml.png')+'.')
story.append(PageBreak())
h('2. Conteúdo da atividade - implementação e evidências')
table([
['Critério','Implementação no projeto'],
['Herança','Equipamento é abstrata; Notebook e Desktop são suas subclasses.'],
['Interface e polimorfismo','PoliticaCobranca define calcularDiagnostico(); CobrancaNotebook e CobrancaDesktop implementam o contrato. OrdemServico guarda e utiliza uma referência do tipo da interface.'],
['Composição e encapsulamento','OrdemServico cria ItemServico por construtor privado e guarda List&lt;ItemServico&gt;; getItensServico() retorna List.copyOf(itensServico).'],
['Regra por tipo','PoliticasCobranca.para() concentra o switch que seleciona a política pelo TipoEquipamento.'],
['Multiplicidades','A ordem tem um cliente e um equipamento, zero ou um técnico e zero ou vários itens; o UML inclui herança, realização de interface e composição.'],
['Cenário completo','Main cria a ordem, adiciona limpeza, consulta o roteiro, calcula o total e altera o status até CONCLUIDA.']
],[135,364])
h('Testes e execução')
p('Validação realizada com Temurin OpenJDK 25.0.5 em 26/10/2026: <b>19 testes JUnit, zero falhas, zero erros e nenhum teste ignorado</b>. Os cinco testes de ReciclagemTest verificam soma de diagnóstico e serviço, preço por tipo, bloqueio de alteração da lista, rejeição de valor negativo e independência da cópia retornada. Os testes novos seguem Arrange-Act-Assert.')
p('<b>Comandos na raiz do repositório:</b><br/>mvn -f backend/pom.xml clean test<br/>java -cp backend/target/classes Main')
p('<b>Saída do cenário:</b> notebook com diagnóstico de R$ 80,00 e limpeza de R$ 40,00 totaliza R$ 120,00; desktop com apenas diagnóstico totaliza R$ 60,00.')
p('Evidências: '+link('imagem da saída',REPO+'/blob/main/docs/atividade-11/terminal-v11.png')+' e '+link('texto da execução',REPO+'/blob/main/docs/atividade-11/saida-terminal-v11.txt')+'.<br/>Código: '+link('backend/src/main/java',REPO+'/tree/main/backend/src/main/java')+'. Testes: '+link('backend/src/test/java',REPO+'/tree/main/backend/src/test/java')+'.')
h('3. Decisões e pendências')
p('<b>Decisões:</b> reutilizar a hierarquia existente; separar a seleção da política do cálculo; usar BigDecimal para dinheiro; controlar a criação dos itens na ordem e proteger a lista retornada. As tarifas são regras acadêmicas propostas para o exercício.')
p('<b>Próximos passos:</b> apresentação individual do código e envio da ficha e do link na plataforma Aula. A documentação atualizada está na main; a tag v11 preserva a organização original da entrega.')
story.append(PageBreak())
h('4. Declaração de uso de Inteligência Artificial')
p('(X) A equipe utilizou ferramenta de IA nesta atividade.<br/>( ) A equipe não utilizou ferramenta de IA nesta atividade.')
p('Trabalho desenvolvido com apoio do OpenAI Codex na implementação, nos testes e na documentação.')
table([
['Campo','Registro'],
['Data e ferramenta','26/10/2026 - OpenAI Codex.'],
['Objetivo do uso','Apoiar a aplicação dos conceitos de orientação a objetos no domínio TechFix e preparar os artefatos da Atividade 11.'],
['Resumo da interação','Adequação do projeto ao enunciado, políticas de cobrança, testes JUnit, diagrama de classes, organização da documentação e ficha de entrega.'],
['Resultado aproveitado','Incremento Java com cobrança por tipo, testes automatizados e materiais da entrega.'],
['Verificação adotada','Execução de testes Maven e de Main em Java 25; conferência da correspondência entre código, regras e UML; inspeção visual dos documentos.'],
['Responsáveis pela decisão final','Arthur Scharfenberger e Lucas Oliveira da Silva.']
],[135,364])
h('5. Responsabilidade e autoria')
p('Declaração para confirmação no ato da entrega: ao submeter esta ficha, os integrantes confirmam a leitura e a compreensão do conteúdo e assumem responsabilidade por sua correção e coerência, inclusive pelas partes desenvolvidas com apoio de IA.')
p('Nomes dos integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva.')
story.append(Spacer(1,24))
p('Assinatura: __________________________________________________<br/>Arthur Scharfenberger')
story.append(Spacer(1,18))
p('Assinatura: __________________________________________________<br/>Lucas Oliveira da Silva')
p('Data da confirmação: ______ / ______ / __________')
def footer(canvas,doc):
    canvas.setFont('Arial',8)
    canvas.setFillColor(colors.HexColor('#555555'))
    canvas.drawString(48,25,'TechFix | Atividade 11 | Entrega final | 26/10/2026')
    canvas.drawRightString(A4[0]-48,25,str(doc.page))
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=40,bottomMargin=44,title='Ficha Padrão de Entrega - Atividade 11 - TechFix',author='TechFix')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(OUT)
assert len(reader.pages)==3, len(reader.pages)
text=''.join(page.extract_text() for page in reader.pages)
assert REPO in text and '5. Responsabilidade e autoria' in text
assert sum(len(page.get('/Annots',[])) for page in reader.pages)>=8
qa=ROOT/'tmp/pdfs/ficha11'
qa.mkdir(parents=True,exist_ok=True)
render=pdfium.PdfDocument(str(OUT))
for i in range(len(render)):
    render[i].render(scale=1.4).to_pil().save(qa/f'pagina-{i+1}.png')
print(f'PDF criado e verificado: {len(reader.pages)} páginas, links clicáveis presentes.')
