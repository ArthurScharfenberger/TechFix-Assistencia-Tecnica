"""Fichas de POO nas cinco seções institucionais; PDFs e PNGs para conferência.

Uso: python scripts/gerar-fichas-poo.py 10 13 14
Requer reportlab e PyMuPDF. Não preenche assinaturas nem declara envio.
"""
from pathlib import Path
import sys
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pymupdf

ROOT=Path(__file__).resolve().parents[1]
REPO='https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica'
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
styles={
 'body':ParagraphStyle('body',fontName='Arial',fontSize=10.5,leading=15,spaceAfter=9),
 'heading':ParagraphStyle('heading',fontName='ArialBold',fontSize=12,leading=17,spaceBefore=10,spaceAfter=8),
 'title':ParagraphStyle('title',fontName='ArialBold',fontSize=17,leading=22,spaceAfter=10),
}
data={
 '10':{
 'title':'Revisão técnica', 'tag':None,
 'summary':'Revisão técnica realizada em 23/11/2026. Foram executados os 31 testes anteriores, verificados os avisos do compilador e comparados código, README e UML. O POM foi ajustado de Java 25 para Java 17, com versão do plugin de compilação fixada e análise -Xlint:all. A revisão não encontrou condicionais instanceof para decidir preços; a seleção da política já está centralizada.',
 'details':'O serviço ainda estava no pacote de domínio e o Main acumulava o cenário. Essas alterações foram destinadas à A13. A documentação de execução foi consolidada e as tags históricas preservadas. Os defeitos DT01, DT04 e DT05, documentados na revisão anterior de Processos e aplicáveis ao Java, foram selecionados para a A14. São achados registrados no projeto, não feedback inventado da professora.',
 'pending':'PENDÊNCIA DO REQUISITO CENTRAL: a dupla precisa registrar o retorno real da defesa AP2 (pedido da professora, dificuldade percebida, correção ou justificativa para adiar). Esse relato não foi localizado nem fornecido. A revisão técnica está feita, mas não se declara a A10 integralmente atendida. O commit é de 23/11; não satisfaz retroativamente a exigência de commit até o prazo original.',
 },
 '13':{
 'title':'Robustez da aplicação','tag':'v13',
 'summary':'O Java foi organizado em dominio, servico, repositorio e app. Main apenas monta as dependências e inicia ApresentacaoConsole. ServicoOrdens recebe RepositorioOrdens pelo construtor; o domínio não importa implementações de persistência. RegraNegocioException possui as subclasses DadosInvalidosException, EstadoOrdemException e OrdemDuplicadaException.',
 'details':'As validações ocorrem antes de alterar o estado. O repositório converte IOException e linhas inválidas em RepositorioException com causa preservada. A gravação usa temporário e substituição atômica; o serviço salva antes de concluir. A apresentação captura falhas por operação, mostra três erros distintos e depois conclui uma ordem. Foram aprovados 40 testes (31 cenários anteriores e 9 novos). O README contém tabela de erros, justificativa das exceções não verificadas e uso de try/catch; UML e duas execuções reais estão documentados.',
 'pending':'Preparada em 23/11/2026, após o prazo indicado de 16/11, sem retroagir datas. Rever as classes e ensaiar a microdefesa antes de enviar a ficha e o link na plataforma Aula. Não há confirmação de submissão. O uso é local e sequencial: não há banco de dados nem suporte a concorrência entre processos.',
 },
 '14':{
 'title':'Testes e preparação da entrega final','tag':'v14',
 'summary':'A suíte final inclui testes de regras, exceções com tipo e mensagem, caso-limite com valor zero e teste parametrizado por tipo de equipamento. Os casos anteriores foram preservados e ajustados apenas quando a regra foi corrigida. Os testes de arquivo usam TempDir e a apresentação recebe saída injetada. O registro completo está em docs/melhorias.md.',
 'details':'Um teste de preço foi observado falhar após mudar intencionalmente a tarifa; a alteração foi desfeita em commit próprio. Duas refatorações isoladas, com prefixo refatora:, extraem o formato TSV e nomeiam as tarifas, com testes verdes antes/depois. Foram corrigidos três defeitos anteriores do Java: DT01 (reabertura de concluída), DT04 (atendimento sem técnico) e DT05 (conclusão direta de aberta). README, UML, dependências entre pacotes, logs, imagens e AI.md foram atualizados. A execução foi conferida em clone separado com repositório Maven vazio.',
 'pending':'Entrega de hoje: 23/11/2026, até 19h30, conforme o enunciado. As três correções têm origem na revisão documentada do projeto; não se atribuem à professora ou à defesa AP2. A equipe ainda deve revisar, ensaiar e enviar o link e a ficha na plataforma Aula. O frontend independente não foi alterado. O material não comprova microdefesa ou envio realizados.',
 }
}
for number in sys.argv[1:]:
 info=data[number]; out=ROOT/'docs/poo'/('atividade-'+number);out.mkdir(parents=True,exist_ok=True)
 story=[]
 def p(text,style='body'):story.append(Paragraph(text,styles[style]))
 def link(label,url):return '<link href="'+escape(url)+'" color="#155e91">'+escape(label)+'</link>'
 p('Entrega de Atividade Semanal','title')
 p('Atividade '+number+' — '+info['title'],'heading')
 p('1. Identificação','heading')
 p('<b>Disciplina:</b> Fundamentos de Programação Orientada a Objetos — ADS / ULBRA.<br/><b>Professora:</b> Caroline.<br/><b>Projeto:</b> TechFix — Sistema de Assistência Técnica.<br/><b>Integrantes:</b> Arthur Scharfenberger e Lucas Oliveira da Silva.<br/><b>Preparação:</b> 23/11/2026. <b>Etapa:</b> entrega final única; sem esboço.')
 url=REPO+'/tree/'+info['tag'] if info['tag'] else REPO+'/tree/main/docs/poo/atividade-10'
 p('<b>Link para entrega:</b><br/>'+link(url,url))
 p('2. Conteúdo da atividade','heading')
 p(info['summary']);p(info['details'])
 p('<b>Evidências e ficha no repositório:</b><br/>'+link('Abrir a pasta da atividade '+number,REPO+'/tree/'+(info['tag'] or 'main')+'/docs/poo/atividade-'+number))
 story.append(PageBreak())
 p('3. Decisões e pendências','heading');p(info['pending'])
 p('As datas dos commits são reais. As versões v11 e v12 permanecem inalteradas. As imagens de terminal representam saídas reais registradas em texto, e não uma janela capturada. A ficha reúne resultados técnicos; não declara aceite da professora.')
 p('4. Declaração de uso de Inteligência Artificial','heading')
 p('(X) A equipe utilizou ferramenta de IA nesta atividade.<br/>( ) A equipe não utilizou ferramenta de IA nesta atividade.')
 p('<b>Ferramenta:</b> OpenAI Codex.<br/><b>Participação:</b> auditoria, geração e alteração de código Java, testes, revisão, documentação, diagramas e ficha. O uso incluiu implementação direta. Os resultados de testes e o histórico de commits são verificáveis; o relato de feedback da defesa não foi inventado.')
 p('5. Responsabilidade e autoria','heading')
 p('Ao submeter esta ficha, os integrantes devem confirmar que leram e compreenderam o conteúdo e assumem responsabilidade pela correção e coerência, incluindo as partes desenvolvidas com apoio de IA. A geração desta ficha não substitui essa confirmação.')
 story.append(Spacer(1,20))
 p('Assinatura: _______________________________________________<br/>Arthur Scharfenberger')
 story.append(Spacer(1,13))
 p('Assinatura: _______________________________________________<br/>Lucas Oliveira da Silva')
 p('Data da confirmação: ______ / ______ / __________')
 def footer(canvas,doc):
  canvas.setFont('Arial',8);canvas.drawString(48,25,'TechFix | POO A'+number+' | Preparada em 23/11/2026');canvas.drawRightString(A4[0]-48,25,str(doc.page))
 path=out/('Ficha_Padrao_Entrega_Atividade_'+number+'_Final.pdf')
 SimpleDocTemplate(str(path),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=40,bottomMargin=45,title='POO Atividade '+number+' '+info['title'],author='TechFix').build(story,onFirstPage=footer,onLaterPages=footer)
 qa=ROOT/'tmp/poo-auditoria'/('ficha-'+number);qa.mkdir(parents=True,exist_ok=True)
 doc=pymupdf.open(str(path))
 for i in range(len(doc)):doc[i].get_pixmap(matrix=pymupdf.Matrix(1.25,1.25)).save(str(qa/('pagina-'+str(i+1)+'.png')))
 assert len(doc)==2,(number,len(doc))
 print('Ficha '+number+': '+str(len(doc))+' páginas renderizadas.')
