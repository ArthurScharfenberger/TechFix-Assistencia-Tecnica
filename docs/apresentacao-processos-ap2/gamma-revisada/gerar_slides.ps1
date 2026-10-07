$ErrorActionPreference='Stop'
$base=$PSScriptRoot
$repo=Split-Path (Split-Path (Split-Path $base))
$qa=Join-Path $repo 'tmp/ap2-gamma'
New-Item -ItemType Directory -Force -Path $qa | Out-Null
$items=Get-Content (Join-Path $base 'conteudo.json') -Encoding UTF8 -Raw | ConvertFrom-Json
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class PresentationFonts {
 [DllImport("gdi32.dll", CharSet=CharSet.Unicode)] public static extern int AddFontResourceEx(string file, uint flags, IntPtr reserved);
 [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern IntPtr SendMessageTimeout(IntPtr h, uint m, IntPtr w, IntPtr l, uint f, uint t, out IntPtr r);
}
'@
foreach($f in (Get-ChildItem (Join-Path $base 'fontes') -Filter '*.ttf')){[void][PresentationFonts]::AddFontResourceEx($f.FullName,0,[IntPtr]::Zero)}
$result=[IntPtr]::Zero
[void][PresentationFonts]::SendMessageTimeout([IntPtr]65535,29,[IntPtr]::Zero,[IntPtr]::Zero,2,1000,[ref]$result)
function Color($hex){return [int]([Convert]::ToInt32($hex.Substring(0,2),16)+256*[Convert]::ToInt32($hex.Substring(2,2),16)+65536*[Convert]::ToInt32($hex.Substring(4,2),16))}
$bg=Color 'F7FAFB';$navy=Color '16354D';$teal=Color '116B70';$brown=Color '4A1F24';$body=Color '272525';$muted=Color '6E4F4A';$pale=Color 'E7F1F2';$line=Color 'DCE5E7';$white=Color 'FFFFFF'
$serif='Ancizar Serif SemiBold';$sans='Mozilla Text';$semibold='Mozilla Text SemiBold';$mono='IBM Plex Mono'
function Text($s,$x,$y,$w,$h,$txt,$size=14,$font=$sans,$color=$body){
 $z=$s.Shapes.AddTextbox(1,$x,$y,$w,$h)
 $z.TextFrame.MarginLeft=0;$z.TextFrame.MarginRight=0;$z.TextFrame.MarginTop=0;$z.TextFrame.MarginBottom=0;$z.TextFrame.WordWrap=-1;$z.TextFrame.AutoSize=0
 $r=$z.TextFrame.TextRange;$r.Text=$txt;$r.Font.Name=$font
 try{$r.Font.Size=[single]$size}catch{throw ('Texto: '+$txt+'; tamanho: '+$size+'; fonte: '+$font+'; '+$_.Exception.Message)}
 $r.Font.Color.RGB=$color
 $r.ParagraphFormat.SpaceBefore=0;$r.ParagraphFormat.SpaceAfter=0
 $r.ParagraphFormat.LineRuleWithin=-1;$r.ParagraphFormat.SpaceWithin=1.12
 $z.Left=[single]$x;$z.Top=[single]$y;$z.Width=[single]$w;$z.Height=[single]$h
 return $z
}
function Rect($s,$x,$y,$w,$h,$fill=$pale,$border=$false){
 $z=$s.Shapes.AddShape(1,$x,$y,$w,$h);$z.Fill.ForeColor.RGB=$fill
 if($border){$z.Line.ForeColor.RGB=$teal;$z.Line.Weight=[single]0.8}else{$z.Line.Visible=0};return $z
}
function Rule($s,$x,$y,$w,$color=$teal,$weight=1.2){$z=$s.Shapes.AddLine($x,$y,($x+$w),$y);$z.Line.ForeColor.RGB=$color;$z.Line.Weight=[single]$weight}
function Arrow($s,$x1,$y1,$x2,$y2){$z=$s.Shapes.AddLine($x1,$y1,$x2,$y2);$z.Line.ForeColor.RGB=$teal;$z.Line.Weight=2;$z.Line.EndArrowheadStyle=3}
function Header($s,$eyebrow,$title){$null=Text $s 48 28 864 18 $eyebrow 10.5 $mono $muted;$null=Text $s 48 58 864 86 $title 32 $serif $navy}
function Footer($s,$i,$speaker){$null=Text $s 48 519 845 15 ($i.ToString('00')+' · '+$speaker+'  /  TECHFIX · AP2') 9 $mono $muted}
function Table($s,$x,$y,$widths,$rows,$rh=36,$size=14){
 $w=($widths|Measure-Object -Sum).Sum;$t=$s.Shapes.AddTable($rows.Count,$widths.Count,$x,$y,$w,($rows.Count*$rh)).Table
 for($c=1;$c -le $widths.Count;$c++){$t.Columns.Item($c).Width=$widths[$c-1]}
 for($r=1;$r -le $rows.Count;$r++){
  $t.Rows.Item($r).Height=$rh
  for($c=1;$c -le $widths.Count;$c++){
   $ce=$t.Cell($r,$c);$sh=$ce.Shape;$sh.Fill.ForeColor.RGB=$bg
   $sh.TextFrame.MarginLeft=9;$sh.TextFrame.MarginRight=8;$sh.TextFrame.MarginTop=6;$sh.TextFrame.MarginBottom=6;$sh.TextFrame.VerticalAnchor=3
   $sh.TextFrame.TextRange.Text=[string]$rows[$r-1][$c-1];$sh.TextFrame.TextRange.Font.Name=$(if($r -eq 1){$semibold}else{$sans})
   $sh.TextFrame.TextRange.Font.Size=[single]$size;$sh.TextFrame.TextRange.Font.Color.RGB=$(if($r -eq 1){$brown}else{$body})
   foreach($b in 1..4){$ce.Borders.Item($b).ForeColor.RGB=$bg;$ce.Borders.Item($b).Weight=[single]0.25}
   $ce.Borders.Item(3).ForeColor.RGB=$line;$ce.Borders.Item(3).Weight=[single]0.6
  }
 }
 for($r=1;$r -le $rows.Count;$r++){
  for($c=1;$c -le $widths.Count;$c++){
   if($r -gt 1){$t.Cell($r,$c).Borders.Item(1).ForeColor.RGB=$line;$t.Cell($r,$c).Borders.Item(1).Weight=[single]0.6}
   $t.Cell($r,$c).Borders.Item(3).ForeColor.RGB=$line;$t.Cell($r,$c).Borders.Item(3).Weight=[single]0.6
  }
  if($r -gt 1 -and $rows[0][0] -eq 'Tamanho'){$t.Cell($r,1).Shape.Fill.ForeColor.RGB=$pale}
  if($r -gt 1 -and $rows[0][0] -eq 'Risco'){$t.Cell($r,3).Shape.Fill.ForeColor.RGB=$pale}
 }
 return $t
}
function FlowBox($s,$x,$y,$w,$h,$txt,$diamond=$false){
 if($diamond){$z=$s.Shapes.AddShape(4,$x,$y,$w,$h);$z.Fill.ForeColor.RGB=$pale;$z.Line.ForeColor.RGB=$teal;$z.Line.Weight=[single]1.1}else{$z=Rect $s $x $y $w $h}
 if($diamond){
  $label=Text $s ($x+$w*.17) ($y+($h-32)/2) ($w*.66) 36 $txt 12 $sans $body
  $label.TextFrame.TextRange.ParagraphFormat.Alignment=2
 }else{$null=Text $s ($x+12) ($y+($h-36)/2) ($w-24) 43 $txt 13 $sans $body}
 return $z
}
$pp=New-Object -ComObject PowerPoint.Application
$pres=$pp.Presentations.Add(0);$pres.PageSetup.SlideWidth=960;$pres.PageSetup.SlideHeight=540
try{
 for($i=0;$i -lt $items.Count;$i++){
  $n=$i+1;$item=$items[$i];$s=$pres.Slides.Add($n,12);$s.FollowMasterBackground=0;$s.Background.Fill.ForeColor.RGB=$bg
  switch($n){
   1{
    $null=Rect $s 0 0 256 540 $teal
    $null=Text $s 36 36 175 24 'TECHFIX' 10.5 $mono $white
    $null=Text $s 36 435 198 86 "Processos de Engenharia`nde Software`n`nAP2" 14 $sans $white
    $null=Text $s 310 146 597 22 'DO REQUISITO AO COMPONENTE QUE O ATENDE' 10.5 $mono $muted
    $null=Text $s 310 177 600 88 'TechFix' 64 $serif $navy
    $null=Text $s 310 260 606 65 'Assistência Técnica' 48 $serif $navy
    Rule $s 310 330 595
    $null=Text $s 310 351 600 35 'Arthur Scharfenberger e Lucas Oliveira da Silva' 14
    $null=Text $s 310 385 600 30 '07/10/2026' 14
    $null=Text $s 310 515 597 18 '01 · Arthur  /  AP2 · PROCESSOS' 9 $mono $muted
   }
   2{
    Header $s 'REQUISITOS · A3–A5' "Papel e planilhas dificultam`nacompanhar os atendimentos"
    $data=@(@(48,'RF1','Cadastro',"Identificar clientes e`nequipamentos."),@(348,'RF2 e RN1','Ordem de serviço',"Criar e acompanhar OS, com`nestado e técnico responsável."),@(648,'RF3','Pesquisa e histórico',"Pesquisar atendimentos e`nconsultar o histórico."))
    foreach($c in $data){Rule $s $c[0] 231 264 $brown 3;$null=Text $s ($c[0]+18) 254 245 32 $c[1] 20 $serif $teal;$null=Text $s ($c[0]+18) 288 245 29 $c[2] 17 $serif $brown;$null=Text $s ($c[0]+18) 321 245 80 $c[3] 14}
    Rule $s 48 455 864
    $null=Text $s 48 473 864 37 'A3: entrevista simulada com Marcos Almeida. A4/A5 consolidam e refinam os requisitos.' 10.5 $sans $brown
   }
   3{
    Header $s 'A7 · ORGANIZAÇÃO PROPOSTA' "Scrum em Sprints de uma semana,`ncom papéis claros"
    $null=Text $s 48 151 864 42 'Coerente com o ciclo iterativo e incremental da A2: dois desenvolvedores, entregas pequenas, feedback e revisão frequente.' 14
    $data=@(@(48,'SCRUM MASTER E DESENVOLVEDOR','Arthur',"Interface e integração.`nFacilita o fluxo e acompanha`nimpedimentos."),@(348,'DESENVOLVEDOR','Lucas',"Regras de negócio, persistência`ne testes. Participa do`nplanejamento e da revisão."),@(648,'PO INDICADO NO PLANEJAMENTO','Chico Mosca',"Ordena necessidades e valida`no resultado. Agenda de`nfeedback a combinar."))
    foreach($c in $data){$null=Rect $s $c[0] 237 272 174;$null=Text $s ($c[0]+18) 257 240 31 $c[1] 10 $mono $body;$null=Text $s ($c[0]+18) 291 238 35 $c[2] 20 $serif $brown;$null=Text $s ($c[0]+18) 334 236 74 $c[3] 14}
    $null=Text $s 48 467 864 30 'Revisão cruzada: ambos precisam compreender todo o sistema.' 14 $sans $teal
   }
   4{
    Header $s 'A7 · FLUXO E DEFINITION OF DONE' "Uma tarefa só está pronta`ndepois da revisão do colega"
    $labels=@('Backlog',"Seleção para`na Sprint",'Desenvolvimento',"Revisão pelo`ncolega",'Verificação',"Pronta`ntecnicamente")
    for($j=0;$j -lt 6;$j++){$x=48+146*$j;$null=Text $s $x 176 133 23 ('0'+($j+1)) 14 $mono $brown;Rule $s $x 203 133 $brown 1.5;$null=Text $s $x 214 133 58 $labels[$j] 17 $serif $brown}
    $null=Text $s 48 280 864 27 'Falha identificada → correção · Nova necessidade → backlog' 10.5 $sans $brown
    $null=Text $s 48 330 455 33 'DoD' 20 $serif $teal
    $null=Text $s 48 369 480 104 "•  Critérios de aceitação atendidos`n•  Revisão pelo outro integrante`n•  Testes pertinentes e integração verificada`n•  Documentação e evidências atualizadas" 14
    $null=Rect $s 579 329 333 148
    $null=Text $s 597 345 295 31 'Registro separado' 20 $serif $brown
    $null=Text $s 597 383 295 29 'Validação de negócio pelo PO.' 14
    Rule $s 597 416 295
    $null=Text $s 597 432 295 42 'Conexão com A6: revisar antes de declarar concluído.' 14
   }
   5{
    Header $s 'A8 · PLANO DE INCREMENTOS' 'Dois incrementos entregam valor ao atendimento'
    $null=Text $s 42 135 426 36 'I1 · Receber e localizar atendimentos' 20 $serif $teal
    $null=Text $s 492 135 426 36 'I2 · Acompanhar e concluir serviços' 20 $serif $teal
    $null=Text $s 42 174 425 22 '1 P + 3 M + 1 G' 10.5 $sans $brown
    $null=Text $s 492 174 425 22 '3 M + 1 G' 10.5 $sans $brown
    $null=Table $s 42 198 @(86,292,48) @(@('ID','Entrega','Tam.'),@('A8R01','Acesso por perfil','G'),@('A8R02','Cadastro de cliente e equipamento','M'),@('A8R03','Abertura de OS','M'),@('A8R04','Consulta exata pelo número da OS','P'),@('A8R05','Histórico inicial','M')) 35 13
    $null=Table $s 492 198 @(86,292,48) @(@('ID','Entrega','Tam.'),@('A8R06','Atribuir técnico, iniciar e listar suas OS','M'),@('A8R07','Concluir OS sem regressão de estado','M'),@('A8R08','Pesquisar por cliente ou equipamento','M'),@('A8R09','Comprovar desempenho','G')) 42 13
    Rule $s 42 442 876
    $null=Text $s 42 456 876 33 'A8R01–R08 são Must. A8R09 é Should, mas seu critério deve ser atendido antes da implantação.' 12
    $null=Text $s 42 490 876 22 'O histórico de A8R05 continua no I2. Cada incremento pode ocupar várias Sprints.' 10.5 $sans $brown
   }
   6{
    Header $s 'A8 · ESTIMATIVAS PROPOSTAS' "P, M e G são tamanhos relativos,`ncom consenso a registrar"
    $null=Table $s 48 190 @(90,245,529) @(@('Tamanho','Referência','O que entra na estimativa'),@('P','A8R04 · consulta exata','Fluxo limitado, menor incerteza.'),@('M','A8R02 · cadastro','Campos, validações e relacionamentos.'),@('G','A8R01 e A8R09','Autorização e desempenho: incerteza e verificação transversal.')) 38 14
    $null=Text $s 48 362 864 31 'Tamanho inclui implementação e verificação; sem conversão fixa em horas.' 14
    $null=Text $s 48 408 864 33 'Para fechar o consenso da dupla' 20 $serif $teal
    $data=@('Estimativa individual','Comparação','Discussão das diferenças','Registro do acordo')
    for($j=0;$j -lt 4;$j++){$x=48+$j*222;$null=Text $s $x 448 204 22 ('0'+($j+1)) 14 $mono $brown;Rule $s $x 472 204 $brown 1.5;$null=Text $s $x 481 210 25 $data[$j] 13}
   }
   7{
    Header $s 'A8 · REGISTRO DE RISCOS' "Acesso indevido e escopo`ntêm as maiores pontuações"
    $null=Table $s 42 169 @(219,87,97,113,360) @(@('Risco','P × I','Nível','Responsável','Mitigação'),@('R1 · Ampliação indevida do escopo','3×3=9','Alto','Arthur','Manter vínculo A5 → backlog; controlar inclusões.'),@('R2 · Acesso indevido','3×3=9','Alto','Arthur','Autorizar no servidor e testar chamadas diretas à API.'),@('R3 · Perda ou inconsistência de histórico','2×3=6','Alto','Lucas','Gravar OS e evento na mesma transação.'),@('R4 · Desempenho sem comprovação','2×2=4','Moderado','Lucas','Medir com até 10.000 OS; registrar ambiente/cenário.')) 54 13
    $null=Text $s 42 451 876 26 'Login local no navegador não comprova proteção no servidor.' 14
    $null=Text $s 42 486 876 25 'P/I: 1 baixa, 2 média, 3 alta. Produto: 1–2 baixo; 3–4 moderado; 6–9 alto. Responsáveis propostos.' 10.5 $sans $brown
   }
   8{
    Header $s 'A9 · ABERTURA DE OS · A8R02 E A8R03' "O fluxograma mostra sequência,`ndecisões e exceções"
    $null=FlowBox $s 48 164 192 79 "Identidade e`npermissão válidas?" $true
    $null=FlowBox $s 302 164 242 79 "Selecionar ou cadastrar`ncliente e equipamento"
    $null=FlowBox $s 632 164 239 79 "Obrigatórios e vínculo`nválidos?" $true
    Arrow $s 240 203 302 203;$null=Text $s 252 183 45 17 'Sim' 10.5
    Arrow $s 544 203 632 203
    Arrow $s 144 243 144 284;$null=Text $s 157 253 80 18 'Não' 10.5
    $null=FlowBox $s 63 284 164 54 "Negar operação`nEncerrar"
    Arrow $s 752 243 752 284;$null=Text $s 765 253 50 18 'Não' 10.5
    $null=FlowBox $s 632 284 239 54 "Indicar campos`ne permitir correção"
    Arrow $s 632 311 587 311;Arrow $s 587 311 587 222;Arrow $s 587 222 544 222
    $null=Text $s 551 322 75 17 'Corrigir' 10.5 $sans $teal
    Arrow $s 871 204 912 204;Arrow $s 912 204 912 383;Arrow $s 912 383 825 383
    $null=Text $s 884 258 38 18 'Sim' 10.5
    $null=Rect $s 413 358 412 60 $teal
    $null=Text $s 430 370 378 44 "Confirmar → gravar OS + evento inicial`nna mesma transação" 14 $sans $white
    Arrow $s 508 418 508 442;Arrow $s 744 418 744 442
    $null=Rect $s 286 442 284 58
    $null=Text $s 298 451 260 42 "Sucesso: nº único, data/hora`ne estado ABERTA" 13
    $null=Rect $s 603 442 315 58
    $null=Text $s 615 451 291 42 "Falha: preservar formulário;`nnova tentativa sem duplicar OS" 13
    $null=Text $s 48 462 215 40 'Leitura resumida do modelo final da A9.' 10.5 $sans $brown
   }
   9{
    Header $s 'A9 · MODELO DE ESPECIFICAÇÃO' "O wireframe define campos e mensagens`nantes de codificar"
    $null=Rect $s 48 156 470 336 $white $true
    $null=Text $s 71 177 415 35 'Nova ordem de serviço' 20 $serif $navy
    $null=Table $s 71 215 @(128,296) @(@('Cliente','Seleção de cliente'),@('Equipamento','Só os vinculados ao cliente')) 31 14
    $null=Text $s 71 290 416 32 'Cadastro rápido' 17 $serif $body
    $null=Text $s 81 328 200 23 'Nome *' 14;$null=Text $s 293 328 198 23 'Telefone *' 14
    Rule $s 71 354 424 $line .7
    $null=Text $s 81 366 200 23 'Tipo *' 14;$null=Text $s 293 366 198 23 'Defeito *' 14
    $null=Text $s 71 403 421 22 '* Obrigatórios · Erros junto aos campos' 10.5
    $null=Rect $s 71 437 198 39 $bg $true;$null=Text $s 127 447 140 25 'Cancelar' 14
    $null=Rect $s 294 437 198 39 $teal;$null=Text $s 348 447 140 25 'Abrir OS' 14 $sans $white
    $null=Text $s 553 177 359 34 'Campos e estados' 20 $serif $teal
    $null=Text $s 553 216 359 105 "•  Número, data/hora e estado gerados pelo sistema`n•  Falha de gravação mantém os dados`n•  Evitar envios duplicados" 14
    Rule $s 553 339 359
    $null=Text $s 553 359 359 31 'Sucesso ou falha' 20 $serif $brown
    $null=Text $s 553 402 359 70 "Sucesso apresenta protocolo e ABERTA.`n`nOs estados de sucesso e falha são alternativos." 14
   }
   10{
    Header $s 'A10 · ARQUITETURA PROPOSTA' "Quatro componentes, com a interface`nsem acesso direto ao banco"
    $null=Rect $s 48 211 202 125;$null=Text $s 66 229 168 38 'C1 · Interface web' 20 $serif $brown;$null=Text $s 66 272 168 60 'Interação, formulários, consulta e feedback' 14
    $null=Rect $s 332 211 238 149;$null=Text $s 350 229 201 61 "C2 · API e regras de`nnegócio" 20 $serif $brown;$null=Text $s 350 291 201 65 'Valida, cria OS, controla técnico, estados e histórico' 14
    $null=Rect $s 675 157 237 120;$null=Text $s 693 173 201 59 "C3 · Autenticação e`nautorização" 20 $serif $brown;$null=Text $s 693 234 201 43 'Identidade e permissão no servidor' 14
    $null=Rect $s 675 335 237 137;$null=Text $s 693 350 201 60 "C4 · Persistência e`nbanco" 20 $serif $brown;$null=Text $s 693 410 201 58 'Clientes, equipamentos, OS, técnicos, perfis e histórico' 14
    Arrow $s 250 253 332 253;Arrow $s 570 218 675 218;Arrow $s 570 359 675 359;Arrow $s 793 277 793 335
    $null=Text $s 251 177 80 20 'HTTP/JSON' 10.5
    $null=Text $s 258 192 70 35 "HTTPS na`nimplantação" 10.5 $sans $brown
    $null=Text $s 584 165 83 47 "Verificar`nidentidade e`npermissão" 10.5 $sans $brown
    $null=Text $s 581 374 86 34 "Consultar e`ngravar" 10.5 $sans $brown
    $null=Text $s 810 287 105 38 "Consultar`nusuários e perfis" 10.5 $sans $brown
    $null=Text $s 48 403 566 32 'OS + evento de histórico: mesma transação.' 14 $sans $teal
    $null=Text $s 48 444 558 22 'Respostas retornam ao solicitante.' 10.5 $sans $brown
    $null=Text $s 48 478 864 28 'Arquitetura proposta; não exige microsserviços.' 14
   }
   11{
    Header $s 'A10 · RASTREABILIDADE DEMONSTRADA' "Da entrevista simulada à abertura`ne evolução da ordem de serviço"
    $rows=@(@('A3 · Origem','p. 2, §3 e §4.1: RF03 (OS), RF04 (estados), RF05 (técnico).'),@('A4 / A5','RE2 → RF2 + RN1 e HU1/HU2; critérios refinados na A5.'),@('A8 · Trabalho','A8R03 abre no I1; A8R06/R07 atribuem, iniciam e concluem no I2.'),@('A9 · Modelos','§2.2 fluxograma + §2.3 wireframe detalham cadastro e abertura.'),@('A10 · Destino','C1 interage; C2 aplica regras; C3 autoriza; C4 grava OS e evento.'))
    for($j=0;$j -lt 5;$j++){$y=170+61*$j;$null=Text $s 48 $y 155 35 $rows[$j][0] 20 $serif $teal;Arrow $s 217 ($y+14) 243 ($y+14);$null=Text $s 260 ($y+2) 650 47 $rows[$j][1] 16;if($j -lt 4){Rule $s 48 ($y+49) 864 $line .6}}
    $null=Text $s 48 485 864 27 'Marcos Almeida é o personagem da simulação A3. RF03 da A3 e RF3 da A4/A5 têm significados diferentes.' 10.5 $sans $brown
   }
   12{
    Header $s 'A10 · MATRIZ RESUMIDA' 'Requisitos ligados à origem e aos componentes'
    $null=Table $s 42 153 @(73,215,134,268,186) @(@('Requisito','Origem na A3','A8 · itens','Modelo / decisão','Componentes'),@('RF1','p. 2 RF01/02; p. 3 RF14','R02','A9 §2.2/2.3: cadastro','C1, C2, C4'),@('RF2','p. 2 RF03–RF05','R03/06/07','A9: abertura; A10 §2.3: ciclo','C1–C4'),@('RF3','p. 2 RF06/07','R04/05/08','A10 §2.6: consulta/histórico','C1, C2, C4'),@('RN1','p. 2 RF04; A5 refina regra','R03/06/07','A10 §2.3: sem regressão','C2, C4'),@('RNF1','p. 2–3 RNF01–03; A5: metas','R09','A8 §2.4 / A10 §2.6: medição','C1, C2, C4'),@('RNF2','p. 2 RF12; p. 3 RNF04/05','R01','A9/A10: autorizar no servidor','C2, C3, C4'),@('HU1','p. 2 RF01–03/06/07','R02–05/08','A9: atendente; A10: consulta','C1–C4'),@('HU2','p. 2 RF04/05/12','R05–07','A10: técnico; tela a detalhar','C1–C4')) 36 11.5
    $null=Text $s 42 487 876 28 'Fonte: A3 §4; matriz completa em A10 §2.5. C3 autoriza transversalmente as operações protegidas.' 10.5 $sans $brown
   }
   13{
    Header $s 'FECHAMENTO · QUALIDADE E EVOLUÇÃO NA AS' 'As quatro peças orientam a próxima etapa'
    $pairs=@(@('A7 · Processo','Como trabalhar e verificar'),@('A8 · Planejamento','O que entrega valor e em que ordem'),@('A9 · Modelos','Como o comportamento deve ocorrer'),@('A10 · Arquitetura','Qual componente atende ao requisito'))
    for($j=0;$j -lt 4;$j++){$y=163+56*$j;$null=Text $s 48 $y 220 29 $pairs[$j][0] 20 $serif $teal;$null=Text $s 48 ($y+28) 434 25 $pairs[$j][1] 14}
    $null=Rect $s 518 154 394 257
    $null=Text $s 539 172 353 30 'Na AS: integrar e comprovar' 20 $serif $brown
    $null=Text $s 539 219 353 110 "•  Integrar interface, API e banco`n•  Autorizar cada operação no servidor`n•  Testar regras, estados e falhas`n•  Medir desempenho e registrar evidências" 14
    Rule $s 539 342 353
    $null=Text $s 539 358 353 45 'Hoje: frontend local e Java separados. A integração é trabalho planejado.' 12
    Rule $s 48 433 864
    $null=Text $s 48 448 864 39 'RNF1: ≥95% das operações em até 2 s, com até 10.000 OS. Registrar ambiente e cenário.' 16 $semibold $navy
    $null=Text $s 48 487 864 24 'Exposição: 11 minutos · Perguntas: 4 minutos' 10.5 $mono $muted
   }
  }
  if($n -ne 1){Footer $s $n $item.speaker}
  $s.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text=$item.notes+"`r`n`r`nTempo: "+$item.seconds+" segundos.`r`nFontes: "+$item.source+"`r`nReferência visual: docs/entregas-processos/ap2.pdf, produzido pela equipe no Gamma."
 }
 $pres.SaveAs((Join-Path $base 'TechFix-AP2-Gamma-Revisada.pptx'),24,-1)
 $pres.SaveAs((Join-Path $base 'TechFix-AP2-Gamma-Revisada.pdf'),32)
 $alerts=@()
 foreach($sl in $pres.Slides){$sl.Export((Join-Path $qa ('slide-{0:00}.png' -f $sl.SlideIndex)),'PNG',1600,900)
  foreach($sh in $sl.Shapes){if($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1){if($sh.TextFrame.TextRange.BoundHeight -gt ($sh.Height+2)){$alerts+=('Slide '+$sl.SlideIndex+' / '+$sh.Name+' / '+$sh.TextFrame.TextRange.Text)}}}
 }
 $alerts|Set-Content (Join-Path $qa 'overflow.txt') -Encoding UTF8
 Write-Output ('Slides: '+$pres.Slides.Count+'; alertas: '+$alerts.Count)
}finally{$pres.Close();$pp.Quit()}
