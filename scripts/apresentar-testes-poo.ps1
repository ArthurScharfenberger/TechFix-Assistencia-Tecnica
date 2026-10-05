$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$descriptions = @{
 notebookDeveEspecializarDescricaoDoAtendimento = 'Notebook: descrição inclui 16 GB de RAM.'
 desktopDeveEspecializarDescricaoDoAtendimento = 'Desktop: descrição inclui vídeo dedicado.'
 subclassesDevemHerdarDadosComuns = 'Herança: marca do notebook e defeito do desktop preservados.'
 subclassesDevemHerdarValidacaoDeMarca = 'Validação herdada: as duas subclasses rejeitam marca vazia.'
 naoDeveCriarClienteSemNome = 'Cliente: nome vazio impede a criação.'
 naoDeveAdicionarOrdemNulaAoCliente = 'Coleção: inclusão de ordem nula é rejeitada.'
 deveIniciarOrdemComStatusAberta = 'Ordem de serviço: status inicial é ABERTA.'
 deveAlterarStatusParaEmAtendimento = 'Ordem de serviço: atualização para EM_ATENDIMENTO funciona.'
 notebookRetornaEtapasConhecidasNaOrdem = 'Notebook: três etapas esperadas, na ordem, com RAM de 16 GB.'
 desktopComPlacaVideoRetornaEtapasConhecidasNaOrdem = 'Desktop dedicado: três etapas esperadas, na ordem.'
 desktopComVideoIntegradoOrientaDiagnostico = 'Desktop integrado: última etapa orienta testar vídeo integrado.'
 mesmaReferenciaAbstrataDespachaParaImplementacoesDiferentes = 'Polimorfismo: interface despacha para dois roteiros distintos.'
 contratoMantemListaImutavelEConsultaSemEfeitosColaterais = 'Contrato: etapas válidas, lista imutável e consulta repetível.'
 ordemServicoIntegraAmbosOsRoteirosSemAlterarStatus = 'Integração: OS consulta os dois roteiros e permanece ABERTA.'
}
$groups = @{
 EquipamentoTest = 'HERANÇA E ESPECIALIZAÇÃO'
 OrdemServicoTest = 'CLIENTE, COLEÇÕES E ORDEM DE SERVIÇO'
 RoteiroDiagnosticoTest = 'INTERFACE, POLIMORFISMO E CONTRATO'
}
Write-Host ''
Write-Host '====================================================================' -ForegroundColor Cyan
Write-Host '  TECHFIX | Demonstração dos testes de POO' -ForegroundColor Cyan
Write-Host '====================================================================' -ForegroundColor Cyan
Write-Host '  Escopo: notebooks e PCs | Java + JUnit 5 + Maven offline'
Write-Host '  Testamos o programa; os testes não executam diagnóstico físico.'
Write-Host ''
$result = 1
Push-Location $root
try {
 foreach ($name in @('java','javac','mvn')) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) { throw "Comando '$name' ausente. Confira JDK 17+ e Maven no PATH." }
 }
 $logDirectory = Join-Path $root 'tmp/testes-poo'
 New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
 $logPath = Join-Path $logDirectory 'ultima-execucao.log'
 Write-Host '[1/3] Limpando a compilação anterior e recompilando o Java...' -ForegroundColor Yellow
 Write-Host '[2/3] Executando todos os testes reais do JUnit. Aguarde...' -ForegroundColor Yellow
 $timer = [Diagnostics.Stopwatch]::StartNew()
 $maven = (Get-Command mvn).Source
 $ErrorActionPreference = 'Continue'
 & $maven -B -q -o -f backend/pom.xml clean test *> $logPath
 $mavenResult = $LASTEXITCODE
 $ErrorActionPreference = 'Stop'
 $timer.Stop()
 if ($mavenResult -ne 0) {
  Write-Host 'EXECUÇÃO NÃO APROVADA - o Maven retornou erro.' -ForegroundColor Red
  Write-Host 'Nenhum relatório anterior será usado.'
  Get-Content -LiteralPath $logPath -Tail 45 | ForEach-Object { Write-Host $_ }
  Write-Host 'Se faltarem dependências, execute com internet: mvn -B -f backend/pom.xml clean test' -ForegroundColor Yellow
  throw 'Corrija o erro acima e execute novamente.'
 }
 Write-Host ''
 Write-Host '[3/3] Resultados desta execução' -ForegroundColor Yellow
 $reports = @(Get-ChildItem -LiteralPath (Join-Path $root 'backend/target/surefire-reports') -Filter 'TEST-*.xml')
 if (-not $reports.Count) { throw 'Nenhum relatório JUnit gerado. Não é possível confirmar aprovação.' }
 $total=0; $passed=0; $failures=0; $errors=0; $skipped=0
 foreach ($report in ($reports | Sort-Object Name)) {
  [xml]$xml = Get-Content -LiteralPath $report.FullName -Raw -Encoding UTF8
  $suite=$xml.testsuite; $cases=@($suite.SelectNodes('testcase')); $title=$groups[[string]$suite.name]
  if (-not $title) { $title=[string]$suite.name }
  Write-Host ''
  Write-Host "  $title" -ForegroundColor Cyan
  Write-Host "  Classe: $($suite.name) | $($cases.Count) testes"
  foreach ($case in $cases) {
   $total++; $description=$descriptions[[string]$case.name]
   if (-not $description) { $description=[string]$case.name }
   if ($case.SelectSingleNode('failure')) { $status='FALHOU'; $color='Red'; $failures++ }
   elseif ($case.SelectSingleNode('error')) { $status='ERRO'; $color='Red'; $errors++ }
   elseif ($case.SelectSingleNode('skipped')) { $status='IGNORADO'; $color='Yellow'; $skipped++ }
   else { $status='PASSOU'; $color='Green'; $passed++ }
   Write-Host "    [$status] $description" -ForegroundColor $color
  }
 }
 if (-not $total) { throw 'Nenhum teste foi encontrado nos relatórios.' }
 Write-Host ''
 Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan
 Write-Host "  Executados: $total | Passaram: $passed | Falhas: $failures | Erros: $errors"
 Write-Host "  Ignorados: $skipped | Tempo total: $($timer.Elapsed.TotalSeconds.ToString('0.0')) s"
 Write-Host '--------------------------------------------------------------------' -ForegroundColor Cyan
 if ($failures -or $errors -or $skipped) { throw 'Há testes com falha, erro ou ignorados. Confira os relatórios.' }
 Write-Host '  APROVADO: todos os testes executados passaram.' -ForegroundColor Green
 Write-Host ''
 Write-Host '  Evidências disponíveis:' -ForegroundColor Cyan
 Write-Host '    Código dos testes: backend/src/test/java/'
 Write-Host '    Relatórios JUnit: backend/target/surefire-reports/'
 Write-Host '    Log completo: tmp/testes-poo/ultima-execucao.log'
 Write-Host '  Demonstração: java -cp backend/target/classes Main'
 $result=0
} catch {
 Write-Host "ATENÇÃO: $($_.Exception.Message)" -ForegroundColor Red
 $result=1
} finally { Pop-Location }
exit $result
