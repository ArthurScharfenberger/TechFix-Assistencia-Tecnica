<#!
Gera as fichas A7, A8 e A10 dos Markdown usando o modelo institucional e o Word.
Executar no Windows: powershell -ExecutionPolicy Bypass -File docs/gerar_revisoes_processos.ps1
!#>
[CmdletBinding()]
param([string[]]$Atividades = @('A7','A8','A10'))
$ErrorActionPreference = 'Stop'
$base = Join-Path $PSScriptRoot 'entregas-processos'
$template = Join-Path $base 'Documento_Padrao_Entrega_Atividades.docx'
function Clean-Text([string]$value) {
    return ($value -replace '\[([^\]]+)\]\([^)]+\)', '$1' -replace '\*\*', '' -replace '`', '')
}
function Column-Widths($heads) {
    $count=$heads.Count
    $widths = switch ($count) {
        3 { @(120,95,236) }
        4 { @(95,83,177,96) }
        5 { @(65,112,75,81,118) }
        default { @(1..$count | ForEach-Object { 451 / $count }) }
    }
    switch ($heads[0]) {
        'Requisito da A5' { if($count -eq 5) { $widths=@(75,97,65,126,88) } }
        'Ordem / ID' { $widths=@(52,122,65,60,152) }
        'Requisito' { $widths=@(62,78,311) }
        'Tamanho' { $widths=@(52,215,184) }
        'Incremento / itens' { $widths=@(115,170,166) }
        'Probabilidade / Impacto' { $widths=@(136,105,105,105) }
        'Data e ferramenta' { $widths=@(77,100,135,139) }
    }
    return $widths
}
$jobs = @(
    @{Source='A7-Processo-Esboco.md'; Output='A7-Processo-Esboco'},
    @{Source='A7-Processo-Entrega-Final.md'; Output='A7-Processo-Entrega-Final'},
    @{Source='A8-Entrega-Final-Revisada.md'; Output='A8-Entrega-Final'},
    @{Source='A10-Arquitetura-Rastreabilidade-Final.md'; Output='A10-Arquitetura-Rastreabilidade-Final'}
)
$jobs=@($jobs | Where-Object { ($_.Output -split '-')[0] -in $Atividades })
$word = New-Object -ComObject Word.Application
$word.Visible=$false
$word.DisplayAlerts=0
try {
    foreach ($job in $jobs) {
        $lines=@(Get-Content -LiteralPath (Join-Path $base $job.Source) -Encoding UTF8)
        $text=New-Object Text.StringBuilder
        $headings=@()
        $tables=@()
        for ($i=0; $i -lt $lines.Count; $i++) {
            $line=$lines[$i]
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            if ($line.StartsWith('|')) {
                $tag='TABLE_'+$tables.Count
                [void]$text.Append($tag+"_START`r")
                $start=$text.Length
                $heads=@($line.Trim('|').Split('|') | ForEach-Object { $_.Trim() })
                while($i -lt $lines.Count -and $lines[$i].StartsWith('|')) {
                    if ($lines[$i] -notmatch '^\|[\s:|-]+\|$') {
                        $cells=@($lines[$i].Trim('|').Split('|') | ForEach-Object { Clean-Text $_.Trim() })
                        if($cells.Count -ne $heads.Count) { throw 'Tabela Markdown irregular' }
                        [void]$text.Append(($cells -join "`t")+"`r")
                    }
                    $i++
                }
                $i--
                $tables+=@{Start=$start; End=$text.Length; Heads=$heads; Tag=$tag}
                [void]$text.Append($tag+"_END`r`r")
            } elseif($line -match '^!\[') {
                [void]$text.Append("FIGURA_ARQUITETURA`r")
            } elseif($line -match '^(#{1,6})\s+(.+)$') {
                $level=$Matches[1].Length
                $heading=$Matches[2]
                if($level -eq 1) { $heading='Entrega de Atividade Semanal - '+$heading }
                $headings+=@{Start=$text.Length; End=$text.Length+$heading.Length; Level=$level; Text=$heading}
                [void]$text.Append($heading+"`r")
            } else { [void]$text.Append((Clean-Text $line)+"`r") }
        }
        $working=Join-Path ([IO.Path]::GetTempPath()) ('techfix-'+[guid]::NewGuid().ToString()+'.docx')
        Copy-Item -LiteralPath $template -Destination $working
        $doc=$word.Documents.Open($working,$false,$false)
        Write-Output ($job.Output+': preenchendo ficha')
        try {
            $doc.Content.Text=$text.ToString()
            $doc.Content.Style=-1
            $doc.Content.Font.Name='Inter Tight'
            $doc.Content.Font.Size=11
            $doc.Content.Font.Color=0
            $doc.Content.ParagraphFormat.Alignment=0
            $doc.Content.ParagraphFormat.SpaceAfter=6
            $doc.Content.ParagraphFormat.SpaceBefore=0
            $doc.Content.ParagraphFormat.KeepWithNext=0
            foreach($heading in $headings) {
                $range=$doc.Content
                $range.Find.Wrap=0
                if(-not $range.Find.Execute($heading.Text)) { throw 'Título não localizado' }
                if($heading.Level -eq 1) { $range.Style=-63; $range.Font.Size=15 } else { $range.Style=-2; $range.Font.Size=12 }
                $range.Font.Name='Inter Tight'
                $range.Font.Color=0
                $range.Font.Bold=-1
                $range.ParagraphFormat.Alignment=0
                $range.ParagraphFormat.SpaceBefore=10
                $range.ParagraphFormat.SpaceAfter=6
                $range.ParagraphFormat.KeepWithNext=-1
            }
            foreach($tableSpec in ($tables | Sort-Object Start -Descending)) {
                $beginRange=$doc.Content
                $beginRange.Find.Wrap=0
                if(-not $beginRange.Find.Execute($tableSpec.Tag+'_START')) { throw 'Início de tabela não localizado' }
                $endRange=$doc.Content
                $endRange.Find.Wrap=0
                if(-not $endRange.Find.Execute($tableSpec.Tag+'_END')) { throw 'Fim de tabela não localizado' }
                $range=$doc.Range($beginRange.End+1,$endRange.Start)
                $table=$range.ConvertToTable(1)
                $table.AllowAutoFit=$false
                $table.Range.Font.Size=9.5
                $table.Range.Font.Color=0
                $table.Range.ParagraphFormat.SpaceBefore=0
                $table.Range.ParagraphFormat.SpaceAfter=2
                $table.Range.ParagraphFormat.KeepWithNext=0
                $table.Rows.AllowBreakAcrossPages=0
                $table.Rows.Item(1).HeadingFormat=-1
                $table.Rows.Item(1).Range.Font.Bold=-1
                $table.Rows.Item(1).Shading.BackgroundPatternColor=15132390
                $table.TopPadding=4
                $table.BottomPadding=4
                $table.LeftPadding=5
                $table.RightPadding=5
                $table.Range.Cells.VerticalAlignment=1
                $widths=@(Column-Widths $tableSpec.Heads)
                for($col=1; $col -le $widths.Count; $col++) { $table.Columns.Item($col).SetWidth($widths[$col-1],0) }
                $table.Borders.Enable=1
                foreach($edge in -1..-6) {
                    $border=$table.Borders.Item($edge)
                    $border.LineStyle=1
                    $border.Color=14277081
                    $border.LineWidth=4
                }
                foreach($suffix in '_START','_END') {
                    $marker=$doc.Content
                    $marker.Find.Wrap=0
                    if($marker.Find.Execute($tableSpec.Tag+$suffix)) { $marker.Text='' }
                }
            }
            Write-Output ($job.Output+': tabelas formatadas')
            $range=$doc.Content
            $range.Find.Wrap=0
            if($job.Output.StartsWith('A10') -and $range.Find.Execute('FIGURA_ARQUITETURA')) {
                $range.Text=''
                $picture=$doc.InlineShapes.AddPicture((Join-Path $base 'A10-Arquitetura.svg'),$false,$true,$range)
                $picture.LockAspectRatio=-1
                $picture.Width=450
                $picture.AlternativeText='Usuários acessam C1, que chama C2. C2 autoriza via C3 e persiste via C4. C3 consulta perfis em C4.'
            }
            $output=Join-Path $base ($job.Output+'.docx')
            Write-Output ($job.Output+': salvando Word')
            $doc.Save()
            Write-Output ($job.Output+': Word salvo')
        } finally { $doc.Close(0) }
        Copy-Item -LiteralPath $working -Destination $output -Force
        Remove-Item -LiteralPath $working
    }
} finally { $word.Quit() }

python -X utf8 (Join-Path $PSScriptRoot 'gerar_revisoes_processos_pdf.py')
if ($LASTEXITCODE -ne 0) { throw 'Falha ao gerar PDFs' }
