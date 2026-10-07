"""Gera somente os dois documentos históricos de modelagem. A8/A10: gerar_revisoes_processos.ps1."""
from pathlib import Path
import textwrap
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.shared import Inches, Pt
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'entregas-processos'
OUT.mkdir(exist_ok=True)
FONT = 'C:/Windows/Fonts/arial.ttf'

def diagram(name, draft=False, wire=False):
    im = Image.new('RGB', (1400, 1500 if wire else 1700), 'white')
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(FONT, 27)
    title = ImageFont.truetype(FONT, 38)
    def box(x,y,w,h,text,fill='#eaf2f8'):
        d.rounded_rectangle((x,y,x+w,y+h), 12, fill=fill, outline='#254b65', width=3)
        lines = '\n'.join(textwrap.wrap(text, max(15,int(w/15))))
        d.multiline_text((x+20,y+15),lines,font=font,fill='#17354b',spacing=8)
    def arrow(x,y,xx,yy,label=''):
        d.line((x,y,xx,yy),fill='#254b65',width=4)
        if yy>y: pts=[(xx,yy),(xx-9,yy-16),(xx+9,yy-16)]
        elif yy<y: pts=[(xx,yy),(xx-9,yy+16),(xx+9,yy+16)]
        elif xx>x: pts=[(xx,yy),(xx-16,yy-9),(xx-16,yy+9)]
        else: pts=[(xx,yy),(xx+16,yy-9),(xx+16,yy+9)]
        d.polygon(pts,fill='#254b65')
        if label: d.text((min(x,xx)+12,min(y,yy)+12),label,font=font,fill='#17354b')
    d.text((55,35),'TechFix | '+('Wireframe — Nova OS' if wire else 'Fluxograma — Abertura de OS'),font=title,fill='#17354b')
    d.text((55,95),'A8R02 + A8R03 | '+('Esboço proposto' if draft else 'Modelagem final proposta'),font=font,fill='#17354b')
    if wire:
        box(55,170,1290,90,'Ordens de serviço  >  Nova ordem de serviço')
        box(55,295,1290,135,'1. Cliente *  [Selecionar cliente cadastrado v]     [Cadastrar cliente]')
        box(55,465,1290,135,'2. Equipamento *  [Selecionar equipamento deste cliente v]     [Cadastrar equipamento]')
        box(55,635,1290,130,'Resumo do cadastro: nome e telefone do cliente; tipo e defeito do equipamento.')
        box(55,800,1290,125,'Cadastro rápido (A8R02): nome *, telefone *, tipo * e defeito *. Salvar e selecionar os registros criados.')
        box(55,960,1290,120,'Validação: destaque cada campo obrigatório pendente. Equipamento de outro cliente não pode ser selecionado.', '#fff4d9')
        box(55,1120,600,90,'Cancelar')
        box(700,1120,645,90,'Abrir OS (A8R03)')
        box(55,1250,1290,185,'Após salvar: OS nº 000123 — ABERTA — data/hora da abertura. Exibir confirmação somente após gravação. Em falha, preservar dados e permitir nova tentativa.')
    elif draft:
        texts=['Início: atendente inicia o registro','Cadastrar ou selecionar cliente e equipamento','Confirmar abertura de OS','Mostrar número da OS e estado ABERTA','Fim']
        for i,t in enumerate(texts):
            y=210+i*240
            box(300,y,800,130,t)
            if i<4: arrow(700,y+130,700,y+240)
        d.text((65,1510),'Rascunho: fluxo principal; exceções ainda não detalhadas.',font=font,fill='#17354b')
    else:
        steps=[(190,'Início: atendente solicita abrir OS'),(360,'Sessão válida e permissão para abrir OS?'),(550,'Selecionar ou cadastrar cliente e equipamento (A8R02)'),(760,'Campos completos e equipamento vinculado ao cliente?'),(980,'Confirmar e gravar OS + evento inicial de histórico'),(1170,'Gravação concluída com sucesso?'),(1390,'Exibir número único, data/hora e estado ABERTA'),(1560,'Fim')]
        for i,(y,t) in enumerate(steps):
            box(70,y,820,110,t, '#fff4d9' if i in (1,3,5) else '#eaf2f8')
            if i<len(steps)-1: arrow(480,y+110,480,steps[i+1][0], 'Sim' if i in (1,3,5) else '')
        box(1000,355,345,140,'Não: negar acesso. Encerrar.', '#fdecea')
        arrow(890,415,1000,415)
        box(1000,730,345,175,'Não: indicar campos ou vínculo inválido. Corrigir.', '#fdecea')
        arrow(890,810,1000,810)
        d.line((1170,730,1170,605),fill='#254b65',width=4)
        arrow(1170,605,890,605)
        box(1000,1135,345,190,'Não: manter dados; informar falha e permitir tentar novamente.', '#fdecea')
        arrow(890,1220,1000,1220)
        d.line((1170,1135,1170,1035),fill='#254b65',width=4)
        arrow(1170,1035,890,1035)
    im.save(OUT / name)

diagram('esboco-fluxograma.png',draft=True)
diagram('final-fluxograma.png')
diagram('final-wireframe.png',wire=True)

class Delivery:
    def __init__(self, filename, title):
        self.filename=filename
        self.d=Document(OUT/'Documento_Padrao_Entrega_Atividades.docx')
        self.fields=list(self.d.paragraphs)
        self.anchor=self.fields[10]._p
        self.ia_table=self.d.tables[0]
        self.fill(0, 'Entrega de Atividade Semanal - '+title)
        self.fill(3, 'Atividade (código e nome): '+title)
        self.fill(4, 'Etapa (AP1 / AP2 / AS): ____________________ (confirmar no AVA)')
        self.fill(5, 'Equipe: TechFix')
        self.fill(6, 'Integrantes: Arthur Scharfenberger e Lucas Oliveira da Silva')
        self.fill(7, 'Data de entrega: ____________________ (preparação: 30/09/2026)')
        self.md=['# '+title+'\n','## 1. Identificação\n']
        self.md.extend(self.fields[i].text+'\n' for i in range(3,8))
        self.md.append('## 2. Conteúdo da atividade\n')
    def fill(self,index,text):
        p=self.fields[index]
        if p.runs:
            p.runs[0].text=text
            for run in p.runs[1:]: run.text=''
        else: p.add_run(text)
    def insert(self,element):
        self.anchor.addprevious(element)
    def h(self,t,level=2):
        self.insert(self.d.add_heading(t,level=level)._p); self.md.append('#'*max(1,level)+' '+t+'\n')
    def p(self,t):
        self.insert(self.d.add_paragraph(t)._p); self.md.append(t+'\n')
    def table(self,heads,rows):
        t=self.d.add_table(rows=1,cols=len(heads))
        self.insert(t._tbl)
        borders=OxmlElement('w:tblBorders')
        for side in ['top','left','bottom','right','insideH','insideV']:
            edge=OxmlElement('w:'+side)
            for key,value in [('val','single'),('sz','4'),('color','A6B8C4')]: edge.set(qn('w:'+key),value)
            borders.append(edge)
        t._tbl.tblPr.append(borders)
        for c,v in zip(t.rows[0].cells,heads): c.text=v
        prop=t.rows[0]._tr.get_or_add_trPr(); prop.append(OxmlElement('w:tblHeader'))
        for row in rows:
            for c,v in zip(t.add_row().cells,row): c.text=str(v)
        for row in t.rows:
            for c in row.cells:
                for p in c.paragraphs:
                    for r in p.runs: r.font.size=Pt(9)
        self.md+=['| '+' | '.join(heads)+' |','|'+'|'.join(['---']*len(heads))+'|']
        self.md += ['| '+' | '.join(map(str,r))+' |' for r in rows]; self.md.append('')
    def page(self): self.insert(self.d.add_page_break()._p)
    def pic(self,f):
        self.d.add_picture(str(OUT/f),width=Inches(5.45))
        self.insert(self.d.paragraphs[-1]._p)
        self.md.append(f'![Modelo]({f})\n')
    def finish(self,decisions):
        self.anchor.getparent().remove(self.anchor)
        self.fill(13, 'Decisões tomadas: '+decisions)
        self.fill(14, 'Pendências / próximos passos: revisar o conteúdo com os integrantes, confirmar estimativas e decisões propostas, preencher etapa e data efetiva de entrega e assinar após validação. Na modelagem, confirmar também o código da atividade no AVA.')
        self.fill(18, '(X) A equipe utilizou ferramentas de IA nesta atividade — declaração abaixo.')
        values=['30/09/2026 — ChatGPT/Codex','Preparar e revisar as três entregas de Processos e preencher o documento padrão fornecido.','Confrontar A5 e A8; organizar backlog, estimativas, incrementos e riscos; produzir e explicar modelos ligados ao backlog; adequar todos os arquivos à estrutura institucional.','Texto e diagramas aproveitados como proposta. Estrutura conferida com o modelo; consenso e validação pelos integrantes ainda pendentes.']
        for cell,value in zip(self.ia_table.rows[1].cells,values): cell.text=value
        self.fill(20, 'Forma de verificação adotada pela equipe: proposta para revisão — confronto com A5, A4 e A8 original; conferir rastreabilidade, modelos, estimativas e critérios. Na preparação com IA foram conferidos o conteúdo e a estrutura dos DOCX; a validação dos integrantes ainda está pendente.')
        self.fill(21, 'Responsável pela decisão final sobre o uso: Arthur Scharfenberger e Lucas Oliveira da Silva.')
        self.fill(25, 'Arthur Scharfenberger: ____________________________________________________')
        self.fill(26, 'Lucas Oliveira da Silva: ____________________________________________________')
        self.fill(27, 'Validação e assinaturas pendentes: a declaração acima deverá ser confirmada pelos integrantes após leitura e revisão.')
        for i in range(11,28):
            self.md.append(self.fields[i].text+'\n')
            if i==19:
                self.md.append('| '+' | '.join(c.text for c in self.ia_table.rows[0].cells)+' |')
                self.md.append('|---|---|---|---|')
                self.md.append('| '+' | '.join(values)+' |\n')
        docx_name = 'A8-Entrega-Final' if self.filename == 'A8-Entrega-Final-Revisada' else self.filename
        self.d.save(OUT/(docx_name+'.docx'))
        (OUT/(self.filename+'.md')).write_text('\n'.join(self.md),encoding='utf-8')

# A8/A10 agora usam Markdown como fonte para evitar sobrescrever revisões.
# Gerar com: powershell -ExecutionPolicy Bypass -File docs/gerar_revisoes_processos.ps1

b=Delivery('Modelagem-Esboco','Modelagem — Parte 1: esboço')
b.h('2.1 Funcionalidades escolhidas')
b.p('A8R02 — Cadastrar cliente e equipamento vinculado; A8R03 — Abrir ordem de serviço. Ambos são Must have do I1 da A8 revisada, originados de RF1, RF2, RN1 e HU1. Foram escolhidos porque iniciam todo atendimento e permitem demonstrar valor ao atendente.')
b.p('Este esboço foi preparado nesta revisão; não é apresentado como registro de uma oficina passada. A atividade de modelagem não recebeu número no enunciado fornecido, portanto o código deverá ser confirmado no AVA.')
b.page(); b.h('2.2 Primeiro modelo: fluxograma'); b.pic('esboco-fluxograma.png')
b.h('2.3 Início da explicação')
b.p('O fluxograma representa o caminho principal do atendente, desde a seleção ou cadastro de cliente e equipamento até a confirmação de uma OS ABERTA. A8R02 aparece no cadastro; A8R03 aparece na abertura e no protocolo. A sequência ajuda a identificar os passos e as dependências antes de definir telas ou implementação.')
b.p('Pontos ainda incompletos neste rascunho: campos obrigatórios, vínculo entre cliente e equipamento, autorização, falha ao salvar, data de abertura e evento inicial do histórico. A etapa final detalha essas situações e acrescenta um wireframe para explicar a interação.')
b.finish('Manter A8R02 e A8R03 como foco da modelagem. Próxima etapa: detalhar exceções e a tela de abertura, usando os mesmos IDs da A8 revisada. Validar com os integrantes antes de enviar.')

c=Delivery('Modelagem-Entrega-Final','Modelagem — Parte 2: entrega final')
c.h('2.1 Objetivo e conexão com o backlog')
c.p('Modelar A8R02 (cadastro de cliente e equipamento) e A8R03 (abertura de OS), Must have do incremento I1 em A8-Entrega-Final.docx. O usuário principal é o atendente. Modelos de especificação proposta: representam comportamento desejado e não comprovam implementação.')
c.table(['Modelo','Itens principais e origem','Contribuição'],[['Fluxograma','A8R02 → RF1/HU1; A8R03 → RF2/RN1/HU1','Explicita sequência, decisões, correções e sucesso da abertura.'],['Wireframe','A8R02 → RF1/HU1; A8R03 → RF2/RN1/HU1','Explicita seleção, cadastro, obrigatoriedade, mensagens e confirmação.']])
c.p('Dependências transversais: A8R01/RNF2 controla o acesso; A8R05/RF3 registra o evento inicial. Isso não amplia as duas funcionalidades escolhidas: são condições para executá-las corretamente. Atualização pelo técnico e conclusão pertencem ao I2 e não são o foco destes modelos.')
c.page(); c.h('2.2 Modelo 1 — Fluxograma'); c.pic('final-fluxograma.png')
c.page(); c.h('Explicação e decisão de modelagem')
c.p('O modelo descreve o fluxo do atendente autorizado: selecionar ou cadastrar cliente e equipamento, validar dados e vínculo, confirmar e gravar OS com evento inicial, e receber número único, data/hora e estado ABERTA. As caixas amarelas representam decisões; as saídas negativas encerram acesso indevido ou retornam ao ponto corrigível.')
c.p('O fluxograma foi escolhido para revelar caminhos alternativos que o esboço omitira. Impede tratar campos inválidos ou falhas de armazenamento como sucesso e torna explícito que a autorização precede a operação. Em falha de gravação, preservar o formulário; a nova tentativa deve reutilizar a identificação da operação para evitar OS duplicada caso a resposta anterior se perca. Esta é uma decisão de robustez proposta.')
c.p('Pré-condição de sucesso: identidade e permissão válidas, cliente e equipamento cadastrados e relacionados. Pós-condição: uma OS persistida com número único, data, estado ABERTA e evento de abertura com usuário, data/hora e alteração. Não se permite gravação parcial da OS e do evento. A8R02 ocupa a etapa de cadastro/seleção; A8R03 ocupa confirmação, gravação e protocolo.')
c.page(); c.h('2.3 Modelo 2 — Wireframe'); c.pic('final-wireframe.png')
c.page(); c.h('Explicação e decisão de modelagem')
c.p('O wireframe apresenta a tela Nova OS e os estados de feedback, reunidos na mesma figura como anotações de comportamento. Os avisos e a confirmação não precisam aparecer simultaneamente. O atendente seleciona um cliente e vê somente os equipamentos vinculados; se faltarem registros, o cadastro rápido de A8R02 solicita nome, telefone, tipo e defeito e devolve a seleção ao formulário.')
c.p('A escolha de wireframe complementa o fluxo ao mostrar onde cada informação será fornecida e como o atendente recebe orientação. Os campos com asterisco são obrigatórios; erros são indicados junto ao campo correspondente. Número, data e estado não são digitados pelo usuário: são gerados na abertura de A8R03. O técnico pode permanecer não atribuído, pois o início do atendimento ocorre no I2.')
c.p('Cancelar abandona a abertura sem criar OS; se houver dados não salvos, pedir confirmação de descarte. Abrir OS valida os dados e desabilita novos envios enquanto a operação está em andamento. Sucesso apresenta protocolo, data/hora e ABERTA; falha mantém os dados para correção ou nova tentativa. O sistema verifica permissão também na operação, independentemente da visibilidade do botão.')
c.h('2.4 Cenários para validar os modelos')
c.table(['Cenário','Resultado esperado / backlog'],[['Cliente/equipamento válidos e atendente autorizado','Uma OS com número único, data/hora e ABERTA; evento inicial registrado. A8R02/A8R03.'],['Telefone, tipo ou defeito ausente','Cadastro bloqueado; todos os campos pendentes indicados. A8R02.'],['Equipamento pertence a outro cliente','Seleção/abertura impedida e vínculo solicitado novamente. A8R02/A8R03.'],['Usuário sem permissão','Operação negada e nenhuma OS criada. Dependência A8R01.'],['Falha de gravação ou reenvio','Sem confirmação falsa nem duplicação; dados preservados para nova tentativa. A8R03/A8R05.']])
c.h('2.5 Correções do esboço')
c.table(['Rascunho entregue nesta preparação','Ajuste na versão final','Ganho'],[['Apenas caminho principal.','Adicionar decisões de autorização, validade e gravação.','Exceções e recuperação verificáveis.'],['Cadastro sem dados mínimos nem vínculo explícito.','Nome, telefone, tipo, defeito e seleção restrita ao cliente.','Atender RF1 e evitar OS com equipamento incorreto.'],['Mostrar número e estado apenas.','Acrescentar data/hora, persistência e evento de abertura.','Atender RF2 e a dependência de histórico.'],['Uma sequência sem representação da interface.','Incluir wireframe com seleção, cadastro rápido, ações e feedback.','Explicar como o atendente executa o fluxo.']])
c.p('Comparação reproduzível: Modelagem-Esboco.docx e esboco-fluxograma.png preservam a versão inicial preparada agora. Não há evidência fornecida de um rascunho de modelagem produzido anteriormente em aula; portanto esta evolução é documental e não uma afirmação sobre acontecimentos da oficina.')
c.finish('Fluxograma e wireframe usam os mesmos itens e estados da A8 revisada. Validar com a equipe campos, mensagens, regras propostas de reenvio e cadastro rápido; preencher código/etapa/data conforme AVA e assinar após leitura. Fontes locais: Atividade05.pdf, Atividade04.md, Atividade_A8.pdf e A8-Entrega-Final.docx.')

(OUT/'README.md').write_text('# Entregas de Processos de Engenharia de Software\n\nArquivos para revisão e envio no AVA:\n\n| Entrega | Word | PDF | Fonte consultável |\n|---|---|---|---|\n| A8 — entrega final | [DOCX](A8-Entrega-Final.docx) | [PDF](A8-Entrega-Final.pdf) | [Markdown](A8-Entrega-Final-Revisada.md) |\n| Modelagem — esboço | [DOCX](Modelagem-Esboco.docx) | [PDF](Modelagem-Esboco.pdf) | [Markdown](Modelagem-Esboco.md) |\n| Modelagem — entrega final | [DOCX](Modelagem-Entrega-Final.docx) | [PDF](Modelagem-Entrega-Final.pdf) | [Markdown](Modelagem-Entrega-Final.md) |\n\nTodos seguem a estrutura e preservam o cabeçalho do documento padrão local. As versões Markdown e imagens permitem consultar o conteúdo sem Word. A A8 original permanece preservada; os IDs A8R pertencem à revisão. Os modelos referenciam essa revisão, não o backlog antigo B01–B10.\n\nA preparação não comprova consenso, assinatura, oficina passada ou implementação. Antes do envio, os integrantes devem revisar as estimativas e decisões propostas e preencher etapa, data efetiva e código da atividade de modelagem conforme o AVA.\n\nO [documento padrão fornecido](Documento_Padrao_Entrega_Atividades.docx) foi preenchido diretamente, preservando campos, cinco seções, cabeçalho, margens, tabela de IA e declaração institucional. Diagramas: [rascunho](esboco-fluxograma.png), [fluxograma final](final-fluxograma.png) e [wireframe](final-wireframe.png).\n\nPara reproduzir os DOCX: `python docs/gerar_entregas_processos.py` (python-docx e Pillow; fonte Arial do Windows). O gerador sobrescreve os documentos e as fontes; incorpore nele eventuais revisões feitas no Word antes de executá-lo novamente. O arquivo A8 foi renomeado para `A8-Entrega-Final.docx`; o nome da fonte Markdown foi mantido.\n\nOs PDFs foram exportados pelo Microsoft Word, preservando a formatação dos DOCX: A8 com 5 páginas, esboço com 3 e modelagem final com 6. Para atualizar um PDF após editar o Word, use **Arquivo → Exportar → Criar PDF/XPS** e salve com o mesmo nome nesta pasta. O gerador Python não exporta PDFs.\n\nVerificação realizada: reabertura dos DOCX, estrutura comparada ao padrão, presença dos diagramas e leitura dos PDFs com conferência do número de páginas. Essa verificação não substitui a revisão e assinatura dos integrantes.\n',encoding='utf-8')
print('Gerados:',*[p.name for p in OUT.iterdir()],sep='\n')
