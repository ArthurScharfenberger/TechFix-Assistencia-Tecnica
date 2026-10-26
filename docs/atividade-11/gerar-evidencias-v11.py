"""Gera UML e representação gráfica da saída real de Main, sem serviços externos."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont
import subprocess

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs' / 'atividade-11'
OUT.mkdir(parents=True, exist_ok=True)
im = Image.new('RGB', (1700, 1370), 'white')
d = ImageDraw.Draw(im)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 19)
small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 17)
svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1700" height="1370">', '<rect width="100%" height="100%" fill="white"/>']
def text(x, y, value):
    d.text((x,y),value,font=small,fill='#172b40')
    svg.append(f'<text x="{x}" y="{y+17}" font-family="Arial" font-size="17" fill="#172b40">{escape(value)}</text>')
def line(points, dashed=False):
    for a,b in zip(points, points[1:]):
        if dashed:
            import math
            length=math.dist(a,b)
            for i in range(0,int(length),14):
                p=lambda t:(a[0]+(b[0]-a[0])*t/length,a[1]+(b[1]-a[1])*t/length)
                d.line([p(i),p(min(i+8,length))],fill='#172b40',width=2)
        else: d.line([a,b],fill='#172b40',width=2)
    coords=' '.join(f'{x},{y}' for x,y in points)
    dash=' stroke-dasharray="8 6"' if dashed else ''
    svg.append(f'<polyline points="{coords}" fill="none" stroke="#172b40" stroke-width="2"{dash}/>')
def polygon(points,fill):
    d.polygon(points, fill=fill, outline='#172b40',width=2)
    coords=' '.join(f'{x},{y}' for x,y in points)
    svg.append(f'<polygon points="{coords}" fill="{fill}" stroke="#172b40" stroke-width="2"/>')
def box(x,y,w,title,rows):
    h=60+len(rows)*26
    d.rectangle((x,y,x+w,y+h),fill='#f4f7fb',outline='#172b40',width=2)
    svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#f4f7fb" stroke="#172b40" stroke-width="2"/>')
    text(x+12,y+12,title)
    line([(x,y+44),(x+w,y+44)])
    for i,row in enumerate(rows): text(x+12,y+53+26*i,row)

text(35,20,'TechFix | Atividade 11 | Diagrama de classes (visão das responsabilidades principais)')
box(35,100,320,'Cliente',['- ordensServico: List<OrdemServico>','+ adicionarOrdemServico(os)'])
box(650,100,310,'Tecnico',['- nome: String','- especialidade: String'])
box(1100,100,520,'«interface» PoliticaCobranca',['+ calcularDiagnostico(): BigDecimal'])
box(1040,320,290,'CobrancaNotebook',['+ calcularDiagnostico()'])
box(1370,320,290,'CobrancaDesktop',['+ calcularDiagnostico()'])
box(430,500,540,'OrdemServico',['- politicaCobranca: PoliticaCobranca','- itensServico: List<ItemServico>','- status: StatusOrdemServico','+ adicionarItemServico(descricao, valor)','+ getItensServico(): List<ItemServico>','+ calcularTotal(): BigDecimal','+ getRoteiroDiagnostico(): List<String>','+ alterarStatus(status)'])
box(35,530,330,'OrdemServico.ItemServico',['- descricao: String','- valor: BigDecimal','- ItemServico(descricao, valor)'])
box(1120,520,490,'PoliticasCobranca',['+ para(equipamento): PoliticaCobranca','switch único: NOTEBOOK / DESKTOP'])
box(1040,800,580,'«abstract» Equipamento',['- tipo: TipoEquipamento','- marca, defeito: String','+ descreverAtendimento(): String'])
box(1040,1050,260,'Notebook',['- memoriaRamGb: int','+ gerarRoteiroDiagnostico()'])
box(1360,1050,300,'Desktop',['- placaVideoDedicada: boolean','+ gerarRoteiroDiagnostico()'])
box(430,1060,520,'«interface» RoteiroDiagnostico',['+ gerarRoteiroDiagnostico(): List<String>'])
line([(355,155),(500,155),(500,500)]); text(365,127,'1'); text(505,460,'0..*')
line([(800,500),(800,212)]); text(810,235,'0..1'); text(810,460,'0..*')
line([(430,600),(365,600)]); polygon([(430,600),(414,590),(398,600),(414,610)],'#172b40'); text(395,565,'1'); text(365,615,'0..*')
line([(970,700),(1005,700),(1005,870),(1040,870)]); text(970,665,'0..*'); text(1015,880,'1')
line([(970,530),(990,530),(990,270),(1350,270),(1350,186)]); text(1000,280,'0..*'); text(1358,210,'1')
line([(1175,320),(1175,255),(1230,255),(1230,206)],True); polygon([(1230,186),(1219,206),(1241,206)],'white')
line([(1515,320),(1515,206)],True); polygon([(1515,186),(1504,206),(1526,206)],'white')
line([(970,580),(1120,580)],True); text(980,550,'usa')
line([(1170,1050),(1170,1000),(1320,1000),(1320,958)]); polygon([(1320,938),(1309,958),(1331,958)],'white')
line([(1510,1050),(1510,1000),(1320,1000)])
line([(1040,900),(700,900),(700,1040)],True); polygon([(700,1060),(689,1040),(711,1040)],'white')
line([(690,768),(690,1060)],True); text(705,960,'consulta via interface')
text(35,1240,'Triângulo vazio: herança; tracejado + triângulo: realização; losango preenchido: composição.')
text(35,1275,'Os itens são criados pela ordem; a lista retornada usa List.copyOf; o técnico pode estar ausente.')
text(35,1310,'Tipos auxiliares: TipoEquipamento {NOTEBOOK, DESKTOP}; StatusOrdemServico {ABERTA, EM_ATENDIMENTO, CONCLUIDA}.')
im.save(OUT/'uml.png')
(OUT/'uml.svg').write_text('\n'.join(svg+['</svg>']),encoding='utf-8')

jdks=list((ROOT/'tmp/jdk25').glob('*/bin/java.exe'))
java=str(jdks[0]) if jdks else 'C:/Program Files/Java/jdk-17/bin/java.exe'
output=subprocess.check_output([java,'-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-cp',str(ROOT/'backend/target/classes'),'Main']).decode('utf-8')
(OUT/'saida-terminal-v11.txt').write_text(output,encoding='utf-8')
lines=['> java -cp backend/target/classes Main','']+output.splitlines()
mono=ImageFont.truetype('C:/Windows/Fonts/consola.ttf',20)
width=max(int(mono.getlength(row)) for row in lines)+60
terminal=Image.new('RGB',(width,len(lines)*28+50),'#101827')
draw=ImageDraw.Draw(terminal)
for i,row in enumerate(lines): draw.text((24,24+i*28),row,font=mono,fill='#e2e8f0')
terminal.save(OUT/'terminal-v11.png')
