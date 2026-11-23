"""Imagens das saídas reais e UML das camadas; executar após a suíte Maven.

Requer Pillow. Não usa dados do usuário: Main roda duas vezes em pasta temporária.
O modelo de classes da A11 continua válido; o segundo painel mostra sua evolução.
"""
from pathlib import Path
import math
import subprocess
import sys
import tempfile
import textwrap
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
version = sys.argv[1]
OUT = ROOT / 'docs/poo' / ('atividade-' + version)
OUT.mkdir(parents=True, exist_ok=True)
fontdir = Path('C:/Windows/Fonts')
font = ImageFont.truetype(str(fontdir/'arial.ttf'), 23)
bold = ImageFont.truetype(str(fontdir/'arialbd.ttf'), 26)
mono = ImageFont.truetype(str(fontdir/'consola.ttf'), 21)

def terminal(text, path):
    lines = []
    for line in text.splitlines():
        lines.extend(textwrap.wrap(line, 115, replace_whitespace=False, drop_whitespace=False) or [''])
    im = Image.new('RGB', (max(int(mono.getlength(s)) for s in lines)+64, len(lines)*30+60), '#101827')
    draw = ImageDraw.Draw(im)
    for i, value in enumerate(lines):
        color = '#9ae6b4' if any(s in value for s in ['BUILD SUCCESS', 'Tests run:', '> java', '> mvn']) else '#e2e8f0'
        draw.text((28,25+i*30),value,font=mono,fill=color)
    im.save(path)

with tempfile.TemporaryDirectory(prefix='techfix-v'+version+'-') as folder:
    cmd = ['java','-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-cp',str(ROOT/'backend/target/classes'),
        'com.techfix.app.Main','dados/ordens.tsv']
    outputs = [subprocess.check_output(cmd,cwd=folder).decode('utf-8').replace('\r\n','\n') for _ in range(2)]
assert outputs[0].count('Regra de negócio:') == 3
assert 'Ordens salvas: 1' in outputs[0] and 'Ordens salvas: 2' in outputs[1]
transcript = '> java -cp backend/target/classes com.techfix.app.Main dados/ordens.tsv\n'+outputs[0]
(OUT/('saida-terminal-v'+version+'.txt')).write_text(transcript+'\nSEGUNDA EXECUÇÃO\n'+outputs[1],encoding='utf-8')
terminal(transcript,OUT/('terminal-v'+version+'.png'))
log=(OUT/('testes-v'+version+'.txt')).read_text(encoding='utf-8')
assert 'BUILD SUCCESS' in log
terminal('> mvn -B -f backend/pom.xml clean test\n'+ '\n'.join(l for l in log.splitlines() if 'Tests run:' in l or 'Running ' in l or 'BUILD SUCCESS' in l),OUT/'testes.png')
totals = [0,0,0,0]
for path in (ROOT/'backend/target/surefire-reports').glob('TEST-*.xml'):
    suite=ET.parse(path).getroot()
    totals=[a+int(suite.get(k)) for a,k in zip(totals,['tests','failures','errors','skipped'])]
assert totals[1:] == [0,0,0]
(OUT/'resultado-testes.txt').write_text(f'{totals[0]} testes; 0 falhas; 0 erros; 0 ignorados.\n',encoding='utf-8')

# O painel herdado registra explicitamente composição, herança e multiplicidades.
modelo=Image.open(ROOT/'docs/poo/atividade-11/uml.png').convert('RGB')
im=Image.new('RGB',(2000,3300),'white')
im.paste(modelo.resize((1900,1531)),(50,45))
d=ImageDraw.Draw(im)
ink='#172b40'
d.rectangle((50,45,1950,105),fill='white')
d.text((65,55),'TechFix | Classes do domínio e arquitetura atual | v'+version,font=bold,fill=ink)
def box(x,y,w,title,lines,fill='#f4f7fb'):
    h=55+len(lines)*31
    d.rectangle((x,y,x+w,y+h),fill=fill,outline=ink,width=2)
    d.text((x+12,y+10),title,font=bold,fill=ink)
    d.line([(x,y+47),(x+w,y+47)],fill=ink,width=2)
    for i,s in enumerate(lines): d.text((x+12,y+55+31*i),s,font=font,fill=ink)
    return h
def arrow(points,triangle=False,dashed=False):
    if dashed:
        for start,end in zip(points,points[1:]):
            length=math.dist(start,end)
            for offset in range(0,int(length),15):
                def at(distance):
                    return (start[0]+(end[0]-start[0])*distance/length,
                            start[1]+(end[1]-start[1])*distance/length)
                d.line([at(offset),at(min(offset+9,length))],fill=ink,width=3)
    else:
        d.line(points,fill=ink,width=3)
    a,b=points[-2:]; angle=math.atan2(b[1]-a[1],b[0]-a[0])
    sides=[(b[0]-19*math.cos(angle)+s*9*math.sin(angle),b[1]-19*math.sin(angle)-s*9*math.cos(angle)) for s in [-1,1]]
    if triangle:d.polygon([b,*sides],fill='white',outline=ink,width=2)
    else:d.line([sides[0],b,sides[1]],fill=ink,width=3)
def label(x,y,t): d.text((x,y),t,font=font,fill=ink)
label(65,1580,'Os tipos acima pertencem a com.techfix.dominio. Abaixo: serviço, persistência e exceções.')
box(60,1650,560,'app', ['Main monta as dependências', 'ApresentacaoConsole recebe PrintStream', 'captura RegraNegocioException', 'e RepositorioException'])
box(720,1650,550,'servico.ServicoOrdens',['- repositorio: RepositorioOrdens', '+ concluir(ordem): RegistroOrdem', '+ listar() / proximoNumero()', 'injeção pelo construtor'])
box(1370,1650,560,'dominio.RepositorioOrdens',['«interface»', '+ salvar(RegistroOrdem)', '+ listar(): List<RegistroOrdem>'])
arrow([(620,1720),(720,1720)]); label(635,1680,'usa')
arrow([(1270,1720),(1370,1720)]); label(1282,1680,'usa')
box(60,1970,560,'dominio.RegistroOrdem',['«record» imutável', 'numero, cliente, equipamento,', 'status, total'])
box(720,1970,550,'repositorio',['RepositorioOrdensEmMemoria', 'List<RegistroOrdem>', 'listagem não modificável'])
box(1370,1970,560,'repositorio',['RepositorioOrdensEmArquivo', 'arquivo TSV UTF-8', 'escrita em temporário e troca atômica'])
arrow([(995,1970),(995,1910),(1580,1910),(1580,1798)],True,True)
arrow([(1650,1970),(1650,1798)],True,True)
label(1070,1870,'realizam a interface (triângulo)')
arrow([(800,1830),(800,1925),(335,1925),(335,1970)])
label(80,1890,'serviço cria o registro após validar')
box(60,2300,820,'dominio.RegraNegocioException',['extends IllegalArgumentException', 'base não verificada das regras'])
box(1080,2300,850,'repositorio.RepositorioException',['extends UncheckedIOException (erro técnico)', 'preserva IOException; formato preserva a cadeia de causas'])
box(60,2540,560,'DadosInvalidosException',['dados de entrada inválidos'])
box(720,2540,550,'EstadoOrdemException',['operação fora do estado permitido'])
box(1370,2540,560,'OrdemDuplicadaException',['número já registrado'])
arrow([(340,2540),(340,2417)],True)
arrow([(995,2540),(995,2470),(600,2470),(600,2417)],True)
arrow([(1650,2540),(1650,2495),(760,2495),(760,2417)],True)
label(65,2700,'Domínio lança validações; serviço lança estado/duplicidade; repositório lança erros técnicos; app trata.')
label(65,2740,'A classe de serviço utiliza a interface do domínio; o domínio não importa servico, repositorio ou app.')
label(65,2780,'RegistroOrdem é uma fotografia da conclusão. OrdemServico compõe 0..* ItemServico e expõe cópia.')
label(65,2820,'Os enums são TipoEquipamento {NOTEBOOK, DESKTOP} e StatusOrdemServico {ABERTA, EM_ATENDIMENTO, CONCLUIDA}.')
if version=='14':
    box(60,2910,900,'repositorio.FormatoRegistroTsv',['Codifica e decodifica os cinco campos e escapes.', 'RepositorioOrdensEmArquivo delega o formato.'])
    box(1060,2910,870,'Regra de transição da ordem',['ABERTA → EM_ATENDIMENTO (exige técnico)', 'EM_ATENDIMENTO → CONCLUIDA; concluída não reabre'])
else:
    label(65,2930,'A13 preserva o fluxo anterior; as correções das transições estão planejadas para A14.')
im.save(ROOT/'docs/uml.png'); im.save(OUT/'uml.png')

pkg=Image.new('RGB',(1600,710),'white'); im_old,d_old=im,d
im=pkg; d=ImageDraw.Draw(pkg)
box(60,90,360,'app',['Main e apresentação'])
box(610,90,380,'servico',['casos de uso'])
box(1130,90,410,'repositorio',['arquivo e memória'])
box(610,440,380,'dominio',['entidades e contratos'])
arrow([(420,150),(610,150)])
arrow([(420,130),(490,130),(490,40),(1340,40),(1340,90)])
arrow([(790,176),(790,440)])
arrow([(1340,176),(1340,480),(990,480)])
arrow([(240,176),(240,480),(610,480)])
label(60,600,'Seta A → B: A importa B. O domínio não importa nenhuma das outras três camadas.')
label(60,645,'app também conhece RepositorioException para apresentar erros técnicos ao usuário.')
pkg.save(ROOT/'docs/pacotes.png'); pkg.save(OUT/'pacotes.png')
print(f'Evidências v{version}: {totals[0]} testes, duas JVMs, UML e pacotes.')
