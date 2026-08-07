import { FiltrosRelatorio, ColunaRelatorio } from '../../types/relatorio';
import { PeriodoRapido } from '../../types/indicativos';
import { formatIntervalo } from '../../utils/dateGrouping';
import { iconHTML } from '../../utils/iconHelper';

export const PERIODOS: Array<[PeriodoRapido,string]> = [['HOJE','Hoje'],['ONTEM','Ontem'],['ULTIMOS_7_DIAS','Últimos 7 dias'],['ULTIMOS_30_DIAS','Últimos 30 dias'],['ULTIMOS_90_DIAS','Últimos 90 dias'],['ESTE_MES','Este mês'],['MES_ANTERIOR','Mês anterior'],['ESTE_ANO','Este ano'],['ANO_ANTERIOR','Ano anterior'],['PERSONALIZADO','Período personalizado']];
export const option = (value:string,label:string,current:string):string => `<option value="${value}" ${value===current?'selected':''}>${label}</option>`;

export function renderPeriodFilters(filters:FiltrosRelatorio, extra:string):string {
  return `<section class="card report-filters no-print" aria-label="Filtros do relatório"><div class="report-filter-grid">
    <label><span>Período</span><select id="report-period" class="form-control">${PERIODOS.map(([v,l])=>option(v,l,filters.periodo)).join('')}</select></label>
    <div id="report-custom-dates" class="report-custom-dates ${filters.periodo==='PERSONALIZADO'?'visible':''}"><label><span>Data inicial</span><input id="report-start" type="date" class="form-control" value="${filters.dataInicial}"></label><label><span>Data final</span><input id="report-end" type="date" class="form-control" value="${filters.dataFinal}"></label></div>
    ${extra}
    <label class="report-search"><span>Pesquisar</span><input id="report-search" type="search" class="form-control" value="${filters.pesquisa.replace(/"/g,'&quot;')}" placeholder="Pesquisar nos resultados"></label>
  </div><div class="report-filter-actions"><button id="report-clear" class="btn btn-secondary">${iconHTML('rotate-ccw','',16)} Limpar filtros</button><button id="report-apply" class="btn btn-primary">${iconHTML('list-filter','',16)} Aplicar filtros</button></div></section>`;
}

export function renderSummary(items:Array<{rotulo:string;valor:string}>):string { return `<section class="report-summary">${items.map(x=>`<article class="card report-summary-card"><span>${x.rotulo}</span><strong>${x.valor}</strong></article>`).join('')}</section>`; }

export function renderPrintHeader(title:string,period:string,filters:string,user:string,count:number):string { return `<header class="report-print-header"><div class="report-print-brand"><strong>TechFix</strong><span>Assistência Técnica</span></div><h1>${title}</h1><p><strong>Período:</strong> ${period}</p><p><strong>Filtros:</strong> ${filters||'Nenhum filtro adicional'}</p><p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR')} &nbsp; <strong>Gerado por:</strong> ${user}</p><p><strong>Registros:</strong> ${count}</p></header>`; }

export function renderExportMenu(disabled:boolean):string { return `<details class="report-export no-print"><summary class="btn btn-primary" aria-label="Opções de exportação">${iconHTML('download','',17)} Exportar</summary><div class="report-export-menu" role="menu"><button id="report-csv" role="menuitem" ${disabled?'disabled':''}>${iconHTML('file-spreadsheet','',16)} Exportar CSV</button><button id="report-print" role="menuitem" ${disabled?'disabled':''}>${iconHTML('printer','',16)} Imprimir / Salvar PDF</button></div></details>`; }

export function renderTable<T>(columns:ColunaRelatorio<T>[],rows:T[],sortKey:string,sortDirection:'asc'|'desc'):string { return `<div class="table-responsive"><table class="data-table report-table"><thead><tr>${columns.map(c=>`<th>${c.ordenavel?`<button class="report-sort" data-sort="${c.chave}">${c.titulo}${sortKey===c.chave?iconHTML(sortDirection==='asc'?'chevron-up':'chevron-down','',14):''}</button>`:c.titulo}</th>`).join('')}<th class="report-actions-column no-print">Ações</th></tr></thead><tbody>${rows.map((row,index)=>`<tr>${columns.map(c=>`<td>${c.html?c.html(row):String(c.valor(row)??'-')}</td>`).join('')}<td class="no-print"><button class="btn-icon report-row-detail" data-row="${index}" aria-label="Ver detalhes">${iconHTML('eye','',17)}</button></td></tr>`).join('')}</tbody></table></div>`; }

export function renderReportEmpty():string { return `<section class="card report-empty"><span>${iconHTML('file-search','',34)}</span><h3>Nenhum registro encontrado</h3><p>Não existem dados para os filtros e o período selecionados.</p><button id="report-empty-clear" class="btn btn-secondary no-print">Limpar filtros</button></section>`; }

export function defaultReportFilters():FiltrosRelatorio { return {periodo:'ULTIMOS_30_DIAS',dataInicial:'',dataFinal:'',status:'',prioridade:'',clienteId:'',equipamentoId:'',tecnicoId:'',cargo:'',especialidade:'',valorMinimo:'',valorMaximo:'',quantidadeMinima:'',pesquisa:''}; }
export const periodText = formatIntervalo;
