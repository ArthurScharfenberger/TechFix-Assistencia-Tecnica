$ErrorActionPreference='Stop'
$base=$PSScriptRoot
$qa=Join-Path (Split-Path (Split-Path $base)) 'tmp/ap2-processos'
New-Item -ItemType Directory -Force -Path $qa | Out-Null
$items=Get-Content (Join-Path $base 'conteudo.json') -Encoding UTF8 -Raw | ConvertFrom-Json
function RGB($r,$g,$b) { return [int]($r+256*$g+65536*$b) }
$navy=RGB 21 42 59; $teal=RGB 0 111 111; $gray=RGB 78 94 105; $pale=RGB 234 244 244; $white=RGB 255 255 255; $line=RGB 205 216 220
function Text($s,$x,$y,$w,$h,$txt,$size=22,$bold=$false,$color=$navy) {
 $z=$s.Shapes.AddTextbox(1,$x,$y,$w,$h); $z.TextFrame.MarginLeft=0; $z.TextFrame.MarginRight=0; $z.TextFrame.MarginTop=0; $z.TextFrame.MarginBottom=0
 $z.TextFrame.WordWrap=-1; $z.TextFrame.AutoSize=0
 $z.TextFrame.TextRange.Text=$txt; $z.TextFrame.TextRange.Font.Name='Arial'; $z.TextFrame.TextRange.Font.Size=$size; $z.TextFrame.TextRange.Font.Color.RGB=$color
 if($bold){$z.TextFrame.TextRange.Font.Bold=-1}; $z.TextFrame.TextRange.ParagraphFormat.SpaceAfter=7
 $z.Left=$x;$z.Top=$y;$z.Width=$w;$z.Height=$h
 return $z
}
function Box($s,$x,$y,$w,$h,$txt,$size=21,$fill=$pale) {
 $z=$s.Shapes.AddShape(1,$x,$y,$w,$h); $z.Fill.ForeColor.RGB=$fill; $z.Line.ForeColor.RGB=$teal; $z.Line.Weight=1.2
 $z.TextFrame.MarginLeft=12;$z.TextFrame.MarginRight=10;$z.TextFrame.MarginTop=8;$z.TextFrame.MarginBottom=8;$z.TextFrame.VerticalAnchor=3
 $z.TextFrame.TextRange.Text=$txt; $z.TextFrame.TextRange.Font.Name='Arial';$z.TextFrame.TextRange.Font.Size=$size;$z.TextFrame.TextRange.Font.Color.RGB=$navy
 return $z
}
function Arrow($s,$x1,$y1,$x2,$y2) { $a=$s.Shapes.AddLine($x1,$y1,$x2,$y2);$a.Line.ForeColor.RGB=$teal;$a.Line.Weight=2;$a.Line.EndArrowheadStyle=3 }
function Table($s,$x,$y,$widths,$rows,$rh=45,$size=18) {
 $w=($widths|Measure-Object -Sum).Sum; $t=$s.Shapes.AddTable($rows.Count,$widths.Count,$x,$y,$w,($rows.Count*$rh)).Table
 for($c=1;$c -le $widths.Count;$c++){$t.Columns.Item($c).Width=$widths[$c-1]}
 for($r=1;$r -le $rows.Count;$r++){
  $t.Rows.Item($r).Height=$rh
  for($c=1;$c -le $widths.Count;$c++) {
   $sh=$t.Cell($r,$c).Shape; $sh.Fill.ForeColor.RGB=$(if($r -eq 1){$navy}elseif($r%2 -eq 0){$pale}else{$white})
   $sh.TextFrame.MarginLeft=8;$sh.TextFrame.MarginRight=8;$sh.TextFrame.MarginTop=5;$sh.TextFrame.MarginBottom=5
   $sh.TextFrame.VerticalAnchor=3;$sh.TextFrame.TextRange.Text=[string]$rows[$r-1][$c-1]
   $sh.TextFrame.TextRange.Font.Name='Arial';$sh.TextFrame.TextRange.Font.Size=$size
   $sh.TextFrame.TextRange.Font.Color.RGB=$(if($r -eq 1){$white}else{$navy})
   if($r -eq 1){$sh.TextFrame.TextRange.Font.Bold=-1}
  }
 }
}
function Foot($s,$n,$speaker) {
 $a=$s.Shapes.AddLine(40,499,920,499);$a.Line.ForeColor.RGB=$line
 $null=Text $s 40 509 740 20 ('TECHFIX  /  PROCESSOS DE ENGENHARIA DE SOFTWARE  /  '+$speaker) 10 $false $gray
 $null=Text $s 865 505 55 23 ('{0:00}' -f $n) 14 $true $teal
}
$pp=New-Object -ComObject PowerPoint.Application
$pres=$pp.Presentations.Add(0);$pres.PageSetup.SlideWidth=960;$pres.PageSetup.SlideHeight=540
try {
 for($i=0;$i -lt $items.Count;$i++) {
  $n=$i+1;$item=$items[$i];$s=$pres.Slides.Add($n,12);$s.FollowMasterBackground=0;$s.Background.Fill.ForeColor.RGB=$white
  if($n -ne 1){$null=Text $s 40 28 880 54 $item.title 32 $true}
  switch($n) {
   1 {
    $null=Text $s 50 54 850 25 'AP2  /  ENCONTRO 11  /  07 OUT 2026' 16 $true $teal
    $null=Text $s 46 134 855 100 'TechFix' 76 $true
    $null=Text $s 50 250 830 70 'Processos de Engenharia de Software' 32
    $null=Text $s 50 337 820 58 'Do requisito ao componente que o atende' 28 $false $teal
    $null=Text $s 50 426 830 30 'Arthur Scharfenberger  •  Lucas Oliveira da Silva' 21
   }
   2 {
    $null=Text $s 40 105 850 75 'Papel e planilhas dificultam localizar e acompanhar os atendimentos.' 28 $true
    Table $s 40 189 @(140,420,320) @(@('Origem','Necessidade','Requisito consolidado'),@('A3 • §3–4.1','Cliente e equipamento identificados','RF1 • cadastro'),@('A3 • RF03–05','OS, estado e técnico responsável','RF2 + RN1 • acompanhamento'),@('A3 • RF06–07','Pesquisa e histórico dos serviços','RF3 • consulta e histórico')) 55 19
    $null=Text $s 40 426 880 49 'A3: entrevista simulada com Marcos Almeida, atendente. A4/A5 refinam e priorizam; a numeração muda entre os artefatos.' 17 $false $gray
   }
   3 {
    $null=Text $s 40 100 880 40 'Scrum • Sprints planejadas de uma semana' 27 $true $teal
    $null=Text $s 40 151 880 65 'Ciclo da A2: iterativo e incremental. Equipe pequena, entregas por valor e feedback para ajustar requisitos.' 23
    $cols=@(@(40,'Arthur','Scrum Master + desenvolvedor','Interface e integração; facilita o fluxo e remove impedimentos.'),@(340,'Lucas','Desenvolvedor','Regras, persistência e testes; participa do planejamento e da revisão.'),@(640,'Chico Mosca','PO indicado no planejamento','Ordena necessidades e valida o resultado com a assistência.'))
    foreach($c in $cols){$null=Text $s $c[0] 238 270 36 $c[1] 26 $true;$null=Text $s $c[0] 281 270 55 $c[2] 20 $true $teal;$null=Text $s $c[0] 343 270 95 $c[3] 21}
    $null=Text $s 40 452 880 30 'Revisão cruzada • capacidade conferida a cada Sprint • agenda do PO a combinar' 17 $false $gray
   }
   4 {
    $labels=@('Backlog','Selecionada','Desenvolver','Revisão','Verificação')
    for($j=0;$j -lt 5;$j++){$x=40+$j*178;$null=Box $s $x 130 164 72 $labels[$j] 19;if($j -lt 4){Arrow $s ($x+164) 166 ($x+177) 166}}
    $null=Text $s 40 230 415 40 'Pronta tecnicamente' 27 $true $teal
    $null=Text $s 40 281 415 155 "Critérios de aceitação atendidos`nRevisão pelo colega e testes pertinentes`nIntegração, documentação e evidências" 23
    $null=Text $s 515 230 405 40 'Validação de negócio' 27 $true $teal
    $null=Text $s 515 281 405 155 "PO observa o fluxo pela interface`nFalha → correção`nNova necessidade → backlog" 23
    $null=Text $s 40 451 880 29 'A6 → DoD: revisar antes de concluir. Conclusão técnica e validação têm registros próprios.' 17 $false $gray
   }
   5 {
    $null=Text $s 40 98 425 73 "I1  Receber e localizar`n1 P + 3 M + 1 G" 24 $true $teal
    $null=Text $s 495 98 425 73 "I2  Acompanhar e concluir`n3 M + 1 G" 24 $true $teal
    Table $s 40 176 @(77,290,58) @(@('A8R','Item','Tam.'),@('01','Acesso por perfil','G'),@('02','Cliente e equipamento','M'),@('03','Abrir OS','M'),@('04','Consulta exata por nº','P'),@('05','Histórico inicial','M')) 43 18
    Table $s 495 176 @(77,290,58) @(@('A8R','Item','Tam.'),@('06','Atribuir / iniciar / listar','M'),@('07','Concluir sem regressão','M'),@('08','Busca cliente/equipamento','M'),@('09','Comprovar desempenho','G')) 43 18
    $null=Text $s 495 402 425 34 'Histórico de R05 continua no I2.' 17 $false $gray
    $null=Text $s 40 451 880 32 'R01–R08: Must • R09: Should, exigido antes da implantação • incremento pode ocupar várias Sprints' 16 $false $gray
   }
   6 {
    Table $s 40 115 @(95,370,415) @(@('Escala','Referência','O que aumenta o tamanho'),@('P','A8R04 • consulta exata por nº','Fluxo limitado, menor incerteza'),@('M','A8R02 • cliente/equipamento','Campos, validações e relacionamentos'),@('G','A8R01 / R09 • acesso / desempenho','Incerteza e verificação transversal')) 66 21
    $null=Text $s 40 409 880 36 'Inclui interface, regras, armazenamento e verificação; sem conversão fixa em horas.' 21
    $null=Text $s 40 454 880 28 'Estimativas propostas: cada integrante estima → discute diferenças → registra consenso.' 18 $true $teal
   }
   7 {
    Table $s 40 107 @(210,100,145,425) @(@('Risco','P × I','Responsável','Mitigação prevista'),@('R1 • Escopo','3 × 3 = 9','Arthur','Manter vínculo A5 → backlog; controlar inclusões.'),@('R2 • Acesso indevido','3 × 3 = 9','Arthur','Autorizar no servidor; testar acesso direto à API.'),@('R3 • Perder histórico','2 × 3 = 6','Lucas','Gravar OS e evento na mesma transação.'),@('R4 • Desempenho','2 × 2 = 4','Lucas','Medir por fluxo com até 10.000 OS.')) 66 19
    $null=Text $s 40 452 880 30 'P/I: 1 baixa, 2 média, 3 alta • produto: 1–2 baixo; 3–4 moderado; 6–9 alto' 18 $false $gray
   }
   8 {
    $null=Text $s 40 92 880 30 'A8R02 + A8R03 • leitura resumida do modelo final da A9' 18 $false $gray
    $stages=@('Identidade e permissão válidas?','Cliente/equipamento válidos e vinculados?','Confirmar → gravar OS + evento inicial','Gravou? Exibir nº, data/hora e ABERTA')
    $alts=@('Não → negar operação','Não → indicar campos e corrigir','Uma única transação','Falha → preservar formulário; reenvio sem duplicar')
    for($j=0;$j -lt 4;$j++){$y=137+$j*82;$null=Box $s 40 $y 515 60 $stages[$j] 21;Arrow $s 555 ($y+30) 603 ($y+30);$null=Text $s 616 ($y+7) 304 53 $alts[$j] 19;if($j -lt 3){Arrow $s 295 ($y+60) 295 ($y+80)}}
    $null=Text $s 40 474 880 22 'Utilidade: explicitar sequência, decisões, caminhos de falha e pós-condições.' 16 $true $teal
   }
   9 {
    $null=Text $s 40 94 880 29 'Wireframe • A8R02 cadastro / A8R03 abertura • estados alternativos de feedback' 17 $false $gray
    $null=Box $s 40 135 542 322 '' 20 $white
    $null=Text $s 58 150 495 34 'Nova ordem de serviço' 25 $true
    $null=Box $s 58 199 505 40 'Cliente *                 Selecionar cliente  ▾' 19 $white
    $null=Box $s 58 251 505 40 'Equipamento *       Somente deste cliente  ▾' 19 $white
    $null=Text $s 58 307 498 64 "+ Cadastro rápido`nNome, telefone, tipo e defeito obrigatórios" 19
    $null=Box $s 278 396 123 40 'Cancelar' 18 $white
    $null=Box $s 416 396 147 40 'Abrir OS' 19
    $null=Text $s 620 143 300 35 'Sucesso' 24 $true $teal
    $null=Text $s 620 188 300 76 'Número, data e ABERTA gerados pelo sistema.' 23
    $null=Text $s 620 280 300 35 'Erro ou falha' 24 $true $teal
    $null=Text $s 620 325 300 122 'Erro junto ao campo; manter dados; evitar reenvio duplicado.' 23
    $null=Text $s 40 470 880 23 'Utilidade: discutir campos e mensagens com o PO antes da implementação integrada.' 16 $true $teal
   }
   10 {
    $null=Box $s 40 122 240 88 "C1 • Interface`nAtendente / técnico" 22
    $null=Box $s 367 122 260 88 "C2 • API e regras`nCadastro, OS e consulta" 22
    $null=Box $s 720 122 200 88 "C3 • Acesso`nIdentidade / perfil" 21
    Arrow $s 280 166 367 166;Arrow $s 627 166 720 166
    $null=Text $s 278 91 110 25 'HTTP/JSON' 13 $false $gray
    $null=Text $s 646 91 83 25 'Autorizar' 13 $false $gray
    $null=Box $s 366 318 554 81 "C4 • Persistência`nClientes • equipamentos • OS • histórico • perfis" 22
    Arrow $s 495 210 495 317;Arrow $s 821 210 821 317
    $null=Text $s 506 240 250 55 'OS + evento: mesma transação' 19 $true $teal
    $null=Text $s 40 262 265 133 "Interface chama a API.`nPermissão verificada no servidor.`nBanco sem acesso direto da interface." 20
    $null=Text $s 40 437 880 43 'Arquitetura proposta. C2/C3/C4 podem integrar a mesma aplicação; não exige microsserviços.' 20 $false $gray
   }
   11 {
    $null=Text $s 40 96 880 37 'Exemplo: criar e acompanhar uma ordem de serviço' 24 $true $teal
    $labels=@(@('A3 • origem','§3 e §4.1, p. 2: RF03 (OS), RF04 (estado), RF05 (técnico).'),@('A4 / A5','RE2 → RF2 + RN1; histórias HU1 (atendente) e HU2 (técnico).'),@('A8 • trabalho','A8R03 no I1 abre a OS; A8R06 e R07 no I2 iniciam/concluem.'),@('A9 • modelos','§2.2 fluxograma + §2.3 Nova OS detalham cadastro e abertura.'),@('A10 • destino','C1 interage; C2 aplica regras; C3 autoriza; C4 grava OS e evento.'))
    for($j=0;$j -lt 5;$j++){$y=151+$j*62;$null=Text $s 40 $y 195 47 $labels[$j][0] 22 $true;$null=Text $s 270 $y 650 51 $labels[$j][1] 21;if($j -lt 4){Arrow $s 244 ($y+18) 263 ($y+18)}}
    $null=Text $s 40 469 880 25 'Origem: entrevista simulada com Marcos Almeida. RF03 da A3 ≠ RF3 da A4/A5.' 17 $false $gray
   }
   12 {
    $null=Text $s 40 112 410 40 'O que existe hoje' 28 $true $teal
    $null=Text $s 40 173 410 141 "Interface demonstrável`nDados locais no navegador`nClasses Java executam separadamente" 25
    $null=Text $s 510 112 410 40 'Evolução na AS' 28 $true $teal
    $null=Text $s 510 173 410 183 "Integrar interface, API e banco`nAutorizar no servidor`nTestar regras, falhas e integração`nRegistrar evidências e revisar" 24
    $null=Text $s 40 387 880 77 'RNF1: ≥95% das operações em até 2 s, com até 10.000 OS. Registrar ambiente e cenário; carga concorrente ainda a confirmar.' 25 $true
   }
   13 {
    $pairs=@(@('A7 • Processo','Como trabalhar e verificar'),@('A8 • Planejamento','O que entrega valor e em que ordem'),@('A9 • Modelos','Como o comportamento deve ocorrer'),@('A10 • Arquitetura','Qual componente atende ao requisito'))
    for($j=0;$j -lt 4;$j++){$y=125+$j*65;$null=Text $s 40 $y 270 40 $pairs[$j][0] 26 $true $teal;$null=Text $s 330 $y 590 43 $pairs[$j][1] 27}
    $null=Text $s 40 421 880 56 'AS → critérios transformados em evidências de qualidade' 27 $true
   }
   14 {
    Table $s 40 106 @(110,230,330,210) @(@('Req.','A8 • itens','Modelo / decisão verificável','Componentes'),@('RF1','R02','A9 §2.2 / §2.3 cadastro','C1, C2, C4'),@('RF2','R03 / R06 / R07','A9 abertura; A10 §2.3 ciclo','C1, C2, C3, C4'),@('RF3','R04 / R05 / R08','A10 §2.6 consulta e histórico','C1, C2, C4'),@('RN1','R03 / R06 / R07','A10 §2.3 estados sem regressão','C2, C4'),@('RNF1','R09','A8 §2.4 / A10 §2.6 medição','C1, C2, C4'),@('RNF2','R01 (todos)','A9 autorização / A10 §2.2','C2, C3, C4'),@('HU1','R02–R05 / R08','A9 atendimento / A10 consulta','C1–C4'),@('HU2','R05–R07','A10 técnico; tela a detalhar','C1–C4')) 40 17
   }
   15 {
    Table $s 40 114 @(260,620) @(@('Cenário','Resultado esperado'),@('Abrir OS válida','Número único + data + ABERTA + evento inicial.'),@('Falhar ao gravar','Desfazer OS e evento; preservar o formulário.'),@('Concluir OS','Impedir regressão de estado após CONCLUÍDA.'),@('Chamar API sem permissão','Negar mesmo sem passar pela interface.'),@('Executar operações principais','≥95% em até 2 s, com até 10.000 OS.')) 52 20
    $null=Text $s 40 465 880 30 'Critérios planejados. Não representam resultados de testes da integração proposta.' 18 $false $gray
   }
   16 {
    $null=Text $s 40 107 880 64 'Fontes: A2, A3 simulada, A4, critérios da A5, A6, A7, A8 revisada, modelos locais da A9 e A10.' 25 $true
    $null=Text $s 40 209 880 170 "Conferir antes da entrega:`n• Consenso das estimativas e disponibilidade do PO.`n• Versão da A5 avaliada × cópia local.`n• Correspondência dos modelos locais com a A9 enviada." 24
    $null=Text $s 40 416 880 60 'A1 fora desta revisão por orientação da equipe. Apoio de IA declarado na ficha e no DEVLOG; revisão e domínio do conteúdo cabem à dupla.' 18 $false $gray
   }
  }
  Foot $s $n $item.speaker
  $notes=$item.notes+"`r`n`r`nTempo planejado: "+$item.seconds+" segundos.`r`nFontes locais: "+$item.source
  $s.NotesPage.Shapes.Placeholders.Item(2).TextFrame.TextRange.Text=$notes
 }
 $pres.SaveAs((Join-Path $base 'TechFix-AP2-Processos.pptx'),24)
 $pres.SaveAs((Join-Path $base 'TechFix-AP2-Processos.pdf'),32)
 $bounds=@()
 foreach($sl in $pres.Slides){
  $sl.Export((Join-Path $qa ('slide-{0:00}.png' -f $sl.SlideIndex)),'PNG',1600,900)
  foreach($sh in $sl.Shapes){if($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1){
   if($sh.TextFrame.TextRange.BoundHeight -gt ($sh.Height+2)){$bounds+=('Slide '+$sl.SlideIndex+' / '+$sh.Name+' exceeds text height')}
  }}
 }
 $bounds | Set-Content (Join-Path $qa 'overflow.txt') -Encoding UTF8
 Write-Output ('Exportados '+$pres.Slides.Count+' slides; alertas de texto: '+$bounds.Count)
} finally {$pres.Close();$pp.Quit()}
