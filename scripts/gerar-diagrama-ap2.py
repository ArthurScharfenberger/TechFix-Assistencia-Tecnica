"""Render a code-native SVG summary; the complete UML source is in README.md."""
from pathlib import Path
from html import escape

parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="1220" height="1000" viewBox="0 0 1220 1000" role="img" aria-labelledby="title desc">',
 '<title id="title">TechFix — Diagrama de classes AP2</title>',
 '<desc id="desc">Associações de um para muitos, composição, herança e realização de RoteiroDiagnostico.</desc>',
 '<rect width="1220" height="1000" fill="white"/>',
 '<style>text{font-family:Arial,sans-serif;fill:#172b40}.line{fill:none;stroke:#172b40;stroke-width:2}.dashed{stroke-dasharray:7 5}</style>',
 '<text x="40" y="32" font-size="23" font-weight="bold">TechFix — Classes e relacionamentos da AP2</text>']

def box(x,y,w,title,lines,kind=''):
    h=62+len(lines)*22
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#f8fbff" stroke="#172b40"/>')
    parts.append(f'<text x="{x+w/2}" y="{y+19}" text-anchor="middle" font-size="12">{escape(kind)}</text>')
    parts.append(f'<text x="{x+w/2}" y="{y+40}" text-anchor="middle" font-size="17" font-weight="bold">{escape(title)}</text>')
    parts.append(f'<path d="M{x} {y+50} H{x+w}" class="line"/>')
    for index,line in enumerate(lines):
        parts.append(f'<text x="{x+12}" y="{y+72+index*22}" font-size="12">{escape(line)}</text>')

def line(d,dashed=False):
    parts.append(f'<path d="{d}" class="line {"dashed" if dashed else ""}"/>')

def label(x,y,text):
    parts.append(f'<text x="{x}" y="{y}" font-size="14">{escape(text)}</text>')

box(40,65,290,'Cliente',['- nome, telefone, email','- List<OrdemServico> ordensServico','+ adicionarOrdemServico(os)'])
box(400,65,360,'Tecnico',['- nome, especialidade','+ exibirDados()'])
box(835,65,345,'RoteiroDiagnostico',['+ gerarRoteiroDiagnostico(): List<String>'],'«interface»')
box(400,325,360,'OrdemServico',['- numero, cliente, tecnico, equipamento','- status: StatusOrdemServico','- List<ItemServico> itensServico','+ adicionarItemServico(descricao, valor)','+ getItensServico(): List<ItemServico>','+ getRoteiroDiagnostico(): List<String>','+ alterarStatus(novoStatus)'])
box(835,325,345,'Equipamento',['- tipo, marca, defeito','+ descreverAtendimento(): String','+ gerarRoteiroDiagnostico(): List<String>'],'«abstract»')
box(40,325,290,'StatusOrdemServico',['ABERTA / EM_ATENDIMENTO','CONCLUIDA'],'«enumeration»')
box(40,690,290,'TipoEquipamento',['NOTEBOOK / DESKTOP'],'«enumeration»')
box(400,690,360,'OrdemServico.ItemServico',['- descricao: String; valor: BigDecimal','- ItemServico(descricao, valor)','+ getDescricao(); getValor()'],'«static nested»')
box(815,690,175,'Notebook',['- memoriaRamGb','+ descreverAtendimento()','+ gerarRoteiroDiagnostico()'])
box(1005,690,195,'Desktop',['- placaVideoDedicada','+ descreverAtendimento()','+ gerarRoteiroDiagnostico()'])
# Association end multiplicities match initially empty lists.
line('M185 193 V270 H480 V325');label(194,218,'1');label(490,311,'0..*');label(240,260,'solicita')
line('M580 171 V325');label(590,195,'1');label(590,310,'0..*');label(592,255,'atende')
line('M760 400 H835');label(766,389,'0..*');label(818,389,'1')
line('M400 405 H330',True);label(337,392,'status')
line('M580 541 V690')
parts.append('<polygon points="580,541 590,554 580,567 570,554" fill="#172b40"/>')
label(595,580,'1');label(595,675,'0..*');label(595,622,'compõe')
# Interface realization: dashed line, hollow triangle at the interface.
line('M1007 325 V161',True)
parts.append('<polygon points="1007,149 997,165 1017,165" fill="white" stroke="#172b40" stroke-width="2"/>')
label(1020,250,'implementa')
# Dependency on the interface is a dashed simple arrow, not inheritance.
line('M740 325 V225 H870 V149',True)
line('M864 158 L870 149 L876 158');label(750,215,'consulta contrato')
# Hollow generalization triangle at the superclass.
line('M902 690 V590 H1007 V465');line('M1102 690 V590 H1007')
parts.append('<polygon points="1007,453 997,469 1017,469" fill="white" stroke="#172b40" stroke-width="2"/>')
label(1020,550,'extends')
line('M1180 433 H1208 V860 H185 V774',True);label(210,850,'tipo')
label(40,910,'Multiplicidades: cada OS exige 1 cliente, 1 técnico e 1 equipamento; cada um pode ter 0..* ordens.')
label(40,935,'Uma OS compõe 0..* itens. As setas de herança/interface não recebem multiplicidades.')
label(40,960,'Visão resumida. Atributos, métodos e justificativas completos: Diagrama-Classes/README.md.')
parts.append('</svg>')
Path('Diagrama-Classes/Diagrama-AP2.svg').write_text('\n'.join(parts),encoding='utf-8')
