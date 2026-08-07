import { Chart, TooltipItem } from 'chart.js';
import { renderIndicatorCard } from '../components/indicativos/indicatorCard';
import { EquipamentoService } from '../services/equipamentoService';
import { IndicativosService, ResultadoIndicativos } from '../services/indicativosService';
import { UsuarioService } from '../services/usuarioService';
import { FuncionarioService } from '../services/funcionarioService';
import { FiltrosIndicativos } from '../types/indicativos';
import { downloadCsv } from '../utils/csvExport';
import { formatDuration, formatIntervalo } from '../utils/dateGrouping';
import { formatCurrency, formatDate, getStatusEquipamentoBadge } from '../utils/formatters';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { Toast } from '../components/toast';

const FILTER_SESSION_KEY = 'techFix_indicativosFiltros';

function defaultFilters(): FiltrosIndicativos {
  return { periodo: 'ANO_ANTERIOR', dataInicial: '', dataFinal: '', agrupamento: 'MES', statusChamado: '', prioridade: '', tecnico: '', tipoEquipamento: '', clienteId: '', statusManutencao: '', ordenacaoTecnico: 'CONCLUIDAS' };
}

function readSessionFilters(): FiltrosIndicativos {
  try { return { ...defaultFilters(), ...JSON.parse(sessionStorage.getItem(FILTER_SESSION_KEY) ?? '{}') as Partial<FiltrosIndicativos> }; }
  catch { return defaultFilters(); }
}

function escapeHtml(value: string): string {
  const div = document.createElement('div'); div.textContent = value; return div.innerHTML;
}

export class IndicativosPage {
  private container: HTMLElement;
  private filters: FiltrosIndicativos = readSessionFilters();
  private charts: Array<{ destroy: () => void }> = [];

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'indicativos-page';
  }

  public destroy(): void {
    this.destroyCharts();
  }

  public render(): HTMLElement {
    this.destroyCharts();
    const result = IndicativosService.analyze(this.filters);
    this.container.innerHTML = `
      <div class="indicator-page-actions">
        <button id="export-report" class="btn btn-primary">${iconHTML('download', '', 17)} Exportar relatório</button>
      </div>
      ${this.renderFilters(result)}
      ${result.totalRegistros === 0 ? this.renderEmpty() : this.renderContent(result)}
    `;
    initIcons(this.container);
    this.attachEvents(result);
    if (result.totalRegistros > 0) setTimeout(() => this.initCharts(result), 0);
    return this.container;
  }

  private renderFilters(result: ResultadoIndicativos): string {
    const technicians = FuncionarioService.getAll().sort((a, b) => a.nome.localeCompare(b.nome));
    const users = UsuarioService.getAll().sort((a, b) => a.nome.localeCompare(b.nome));
    const custom = this.filters.periodo === 'PERSONALIZADO';
    return `<section class="card indicator-filters" aria-label="Filtros dos indicativos">
      <div class="filter-grid">
        ${this.select('periodo', 'Período', [
          ['HOJE','Hoje'],['ONTEM','Ontem'],['ULTIMOS_7_DIAS','Últimos 7 dias'],['ULTIMOS_30_DIAS','Últimos 30 dias'],['ULTIMOS_90_DIAS','Últimos 90 dias'],['ESTE_MES','Este mês'],['MES_ANTERIOR','Mês anterior'],['ESTE_ANO','Este ano'],['ANO_ANTERIOR','Ano anterior'],['PERSONALIZADO','Período personalizado'],
        ], this.filters.periodo)}
        <div class="custom-date-fields ${custom ? 'visible' : ''}" id="custom-date-fields">
          ${this.inputDate('dataInicial', 'Data inicial', this.filters.dataInicial)}
          ${this.inputDate('dataFinal', 'Data final', this.filters.dataFinal)}
        </div>
        ${this.select('agrupamento', 'Agrupar gráficos por', [['DIA','Dia'],['SEMANA','Semana'],['MES','Mês'],['ANO','Ano']], this.filters.agrupamento)}
        ${this.select('statusChamado', 'Status da ordem', [['','Todos'],['ABERTO','Aberta'],['EM_ATENDIMENTO','Em atendimento'],['AGUARDANDO_USUARIO','Aguardando cliente'],['CONCLUIDO','Concluída'],['CANCELADO','Cancelada']], this.filters.statusChamado)}
        ${this.select('prioridade', 'Prioridade', [['','Todas'],['BAIXA','Baixa'],['NORMAL','Normal'],['ALTA','Alta'],['URGENTE','Urgente']], this.filters.prioridade)}
        ${this.select('tecnico', 'Técnico responsável', [['','Todos'], ...technicians.map((item) => [item.id, item.nome])], this.filters.tecnico)}
        ${this.select('tipoEquipamento', 'Tipo de equipamento', [['','Todos'],['NOTEBOOK','Notebook'],['DESKTOP','Desktop'],['MONITOR','Monitor'],['IMPRESSORA','Impressora'],['CELULAR','Celular'],['OUTRO','Outro']], this.filters.tipoEquipamento)}
        ${this.select('clienteId', 'Cliente', [['','Todos'], ...users.map((user) => [user.id, user.nome])], this.filters.clienteId)}
        ${this.select('statusManutencao', 'Status do reparo', [['','Todos'],['AGENDADA','Agendada'],['EM_ANDAMENTO','Em andamento'],['CONCLUIDA','Concluída'],['CANCELADA','Cancelada']], this.filters.statusManutencao)}
      </div>
      <div class="filter-actions">
        <div class="active-period">${iconHTML('calendar-range', '', 16)} <span><strong>${formatIntervalo(result.intervalo)}</strong><small>${result.totalRegistros} registro(s) considerado(s)</small></span></div>
        <div><button id="clear-filters" class="btn btn-secondary">${iconHTML('rotate-ccw', '', 16)} Limpar filtros</button><button id="apply-filters" class="btn btn-primary">${iconHTML('list-filter', '', 16)} Aplicar filtros</button></div>
      </div>
    </section>`;
  }

  private renderContent(result: ResultadoIndicativos): string {
    return `
      <section class="indicator-cards">${result.indicadores.map(renderIndicatorCard).join('')}</section>
      <section class="analytics-section"><div class="section-heading"><div><h3>Evolução temporal</h3><p>Aberturas, conclusões, valores e velocidade ao longo do período.</p></div></div>
        <div class="charts-grid analytics-grid">
          ${this.chartCard('Ordens abertas e concluídas', 'Compare a demanda recebida com a capacidade de entrega.', 'orders-flow-chart', result.serieTemporal.length > 0, true)}
          ${this.chartCard('Valor dos serviços concluídos', 'Soma dos reparos concluídos, sem cancelamentos.', 'service-value-chart', result.serieTemporal.some((item) => item.valor > 0))}
          ${this.chartCard('Tempo médio de resolução', 'Evolução em horas para não misturar unidades.', 'resolution-chart', result.serieTemporal.some((item) => item.tempoMedioHoras !== null))}
        </div>
      </section>
      <section class="analytics-section"><div class="section-heading"><div><h3>Distribuição dos atendimentos</h3><p>Entenda onde o volume está concentrado.</p></div></div>
        <div class="charts-grid distribution-grid">
          ${this.chartCard('Ordens por status', 'Situação das ordens criadas no período.', 'status-chart', result.status.length > 0)}
          ${this.chartCard('Ordens por prioridade', 'Urgências aparecem em vermelho.', 'priority-chart', result.prioridades.length > 0)}
          ${this.chartCard('Equipamentos por tipo', 'Tipos presentes nos reparos iniciados no período.', 'equipment-chart', result.tiposEquipamento.length > 0)}
        </div>
      </section>
      <section class="analytics-section"><div class="section-heading"><div><h3>Eficiência operacional</h3><p>Sinais rápidos sobre qualidade, filas e velocidade.</p></div></div>
        <div class="efficiency-grid">${result.eficiencia.map((item) => `<article class="efficiency-item ${item.destaque ?? ''}"><span>${item.titulo}</span><strong>${item.valor}</strong></article>`).join('')}</div>
      </section>
      ${result.rankings.length ? `<section class="analytics-section"><div class="section-heading"><div><h3>Destaques do período</h3><p>Rankings calculados somente quando há dados suficientes.</p></div></div><div class="ranking-grid">${result.rankings.map((item) => `<article class="card ranking-card"><span class="ranking-icon">${iconHTML(item.icone, '', 20)}</span><div><small>${item.titulo}</small><strong>${escapeHtml(item.valor)}</strong><span>${escapeHtml(item.detalhe)}</span></div></article>`).join('')}</div></section>` : ''}
      ${this.renderTechnicians(result)}
      ${this.renderClients(result)}
      ${this.renderReturns(result)}
    `;
  }

  private renderTechnicians(result: ResultadoIndicativos): string {
    if (!result.tecnicos.length) return '';
    return `<section class="analytics-section table-container"><div class="table-toolbar executive-table-heading"><div><h3 class="chart-title">Desempenho por técnico</h3><p class="chart-subtitle">Produtividade combinando ordens e valores de reparos concluídos.</p></div>${this.select('ordenacaoTecnico', 'Ordenar por', [['CONCLUIDAS','Quantidade concluída'],['TAXA','Taxa de conclusão'],['TEMPO','Menor tempo médio'],['VALOR','Maior valor']], this.filters.ordenacaoTecnico, 'compact')}</div><div class="table-responsive"><table class="data-table"><thead><tr><th>Técnico</th><th>Atribuídas</th><th>Concluídas</th><th>Em andamento</th><th>Taxa</th><th>Tempo médio</th><th>Valor</th></tr></thead><tbody>${result.tecnicos.map((item) => `<tr><td><strong>${escapeHtml(item.nome)}</strong></td><td>${item.atribuidas}</td><td>${item.concluidas}</td><td>${item.emAndamento}</td><td>${item.taxaConclusao.toFixed(1)}%</td><td>${formatDuration(item.tempoMedioHoras)}</td><td>${formatCurrency(item.valorServicos)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }

  private renderClients(result: ResultadoIndicativos): string {
    if (!result.clientes.length) return '';
    return `<section class="analytics-section table-container"><div class="table-toolbar executive-table-heading"><div><h3 class="chart-title">Clientes com mais atendimentos</h3><p class="chart-subtitle">Não há valor por cliente porque ordens e reparos ainda não possuem vínculo direto.</p></div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Posição</th><th>Cliente</th><th>Ordens</th><th>Última ordem</th></tr></thead><tbody>${result.clientes.map((item, index) => `<tr><td><span class="rank-position">${index + 1}</span></td><td><strong>${escapeHtml(item.nome)}</strong></td><td>${item.ordens}</td><td>${formatDate(item.ultimaOrdem)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }

  private renderReturns(result: ResultadoIndicativos): string {
    if (!result.retornos.length) return '';
    const equipmentMap = new Map(EquipamentoService.getAll().map((item) => [item.id, item]));
    return `<section class="analytics-section table-container"><div class="table-toolbar executive-table-heading"><div><h3 class="chart-title">Equipamentos com mais retornos</h3><p class="chart-subtitle">Recorrência baseada em múltiplos reparos do mesmo equipamento.</p></div></div><div class="table-responsive"><table class="data-table"><thead><tr><th>Equipamento</th><th>Cliente atual</th><th>Reparos</th><th>Última entrada</th><th>Status atual</th></tr></thead><tbody>${result.retornos.map((item) => `<tr><td><strong>${escapeHtml(item.identificacao)}</strong></td><td>${escapeHtml(item.cliente)}</td><td>${item.reparos}</td><td>${formatDate(item.ultimaEntrada)}</td><td>${equipmentMap.get(item.id) ? getStatusEquipamentoBadge(equipmentMap.get(item.id)!.status) : '<span class="badge badge-neutral">Removido</span>'}</td></tr>`).join('')}</tbody></table></div></section>`;
  }

  private renderEmpty(): string {
    return `<section class="card indicators-empty"><span>${iconHTML('bar-chart-3', '', 38)}</span><h3>Ainda não há dados suficientes para gerar indicativos</h3><p>Cadastre clientes, equipamentos, ordens e reparos para acompanhar os resultados.</p><button id="empty-clear-filters" class="btn btn-primary">Limpar filtros</button></section>`;
  }

  private chartCard(title: string, description: string, id: string, hasData: boolean, wide = false): string {
    return `<article class="card analytics-chart-card ${wide ? 'chart-wide' : ''}"><div class="chart-header"><h4>${title}</h4><p>${description}</p></div><div class="analytics-chart">${hasData ? `<canvas id="${id}" role="img" aria-label="${title}"></canvas>` : `<div class="chart-empty">${iconHTML('inbox', '', 25)}<span>Sem dados para este gráfico</span></div>`}</div></article>`;
  }

  private select(id: string, label: string, options: string[][], value: string, extraClass = ''): string {
    return `<label class="indicator-filter ${extraClass}"><span>${label}</span><select id="${id}" class="form-control">${options.map(([optionValue, text]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHtml(text)}</option>`).join('')}</select></label>`;
  }

  private inputDate(id: string, label: string, value: string): string {
    return `<label class="indicator-filter"><span>${label}</span><input id="${id}" type="date" class="form-control" value="${value}" /></label>`;
  }

  private attachEvents(result: ResultadoIndicativos): void {
    const period = this.container.querySelector('#periodo') as HTMLSelectElement | null;
    period?.addEventListener('change', () => this.container.querySelector('#custom-date-fields')?.classList.toggle('visible', period.value === 'PERSONALIZADO'));
    this.container.querySelector('#apply-filters')?.addEventListener('click', () => { this.readFilterForm(); this.persistAndRender(); });
    const clear = (): void => { this.filters = defaultFilters(); this.persistAndRender(); };
    this.container.querySelector('#clear-filters')?.addEventListener('click', clear);
    this.container.querySelector('#empty-clear-filters')?.addEventListener('click', clear);
    const ordering = this.container.querySelector('#ordenacaoTecnico') as HTMLSelectElement | null;
    ordering?.addEventListener('change', () => { this.filters.ordenacaoTecnico = ordering.value as FiltrosIndicativos['ordenacaoTecnico']; this.persistAndRender(); });
    this.container.querySelector('#export-report')?.addEventListener('click', () => this.exportReport(result));
  }

  private readFilterForm(): void {
    const value = (id: string): string => (this.container.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
    this.filters = { periodo: value('periodo') as FiltrosIndicativos['periodo'], dataInicial: value('dataInicial'), dataFinal: value('dataFinal'), agrupamento: value('agrupamento') as FiltrosIndicativos['agrupamento'], statusChamado: value('statusChamado') as FiltrosIndicativos['statusChamado'], prioridade: value('prioridade') as FiltrosIndicativos['prioridade'], tecnico: value('tecnico'), tipoEquipamento: value('tipoEquipamento') as FiltrosIndicativos['tipoEquipamento'], clienteId: value('clienteId'), statusManutencao: value('statusManutencao') as FiltrosIndicativos['statusManutencao'], ordenacaoTecnico: this.filters.ordenacaoTecnico };
  }

  private persistAndRender(): void { sessionStorage.setItem(FILTER_SESSION_KEY, JSON.stringify(this.filters)); this.render(); }

  private exportReport(result: ResultadoIndicativos): void {
    const users = new Map(UsuarioService.getAll().map((item) => [item.id, item]));
    const equipments = new Map(EquipamentoService.getAll().map((item) => [item.id, item]));
    const orderRows = result.ordensFiltradas.map((item) => ['Ordem', formatIntervalo(result.intervalo), item.id, users.get(item.clienteId)?.nome ?? 'Cliente removido', equipments.get(item.equipamentoId)?.codigo ?? 'Equipamento removido', FuncionarioService.resolveName(item.tecnicoResponsavelId, item.tecnicoResponsavelNomeLegado), item.prioridade, item.status, formatDate(item.criadoEm), formatDate(item.concluidoEm), formatDuration(item.concluidoEm ? (new Date(item.concluidoEm).getTime() - new Date(item.criadoEm).getTime()) / 3_600_000 : null), '']);
    const repairRows = result.reparosFiltrados.map((item) => { const equipment = equipments.get(item.equipamentoId); return ['Reparo', formatIntervalo(result.intervalo), item.id, equipment?.clienteId ? users.get(equipment.clienteId)?.nome ?? '' : '', equipment ? `${equipment.codigo} — ${equipment.fabricante} ${equipment.modelo}` : 'Equipamento removido', FuncionarioService.resolveName(item.tecnicoResponsavelId, item.tecnicoResponsavelNomeLegado), '', item.status, formatDate(item.dataInicio), formatDate(item.dataConclusao), item.dataConclusao ? formatDuration((new Date(`${item.dataConclusao}T12:00:00`).getTime() - new Date(`${item.dataInicio}T12:00:00`).getTime()) / 3_600_000) : '', item.custo.toFixed(2).replace('.', ',')]; });
    downloadCsv(`techfix-indicativos-${new Date().toISOString().slice(0, 10)}.csv`, ['Tipo','Período','Registro','Cliente','Equipamento','Técnico','Prioridade','Status','Abertura/Início','Conclusão','Tempo de resolução','Valor (R$)'], [...orderRows, ...repairRows]);
    Toast.success(`${orderRows.length + repairRows.length} registro(s) exportado(s).`);
  }

  private initCharts(result: ResultadoIndicativos): void {
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    const text = dark ? '#c7d7e9' : '#334155'; const grid = dark ? 'rgba(255,255,255,.08)' : 'rgba(15,23,42,.08)';
    const axis = { x: { ticks: { color: text }, grid: { color: grid } }, y: { ticks: { color: text }, grid: { color: grid }, beginAtZero: true } };
    const legend = { labels: { color: text, usePointStyle: true } };
    const labels = result.serieTemporal.map((item) => item.rotulo);
    this.addChart('orders-flow-chart', { type: 'line', data: { labels, datasets: [{ label: 'Abertas', data: result.serieTemporal.map((item) => item.abertas), borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,.15)', tension: .3 }, { label: 'Concluídas', data: result.serieTemporal.map((item) => item.concluidas), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.15)', tension: .3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend }, scales: axis } });
    this.addChart('service-value-chart', { type: 'bar', data: { labels, datasets: [{ label: 'Valor', data: result.serieTemporal.map((item) => item.valor), backgroundColor: '#14b8a6', borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context: TooltipItem<'bar'>) => formatCurrency(Number(context.raw)) } } }, scales: axis } });
    this.addChart('resolution-chart', { type: 'line', data: { labels, datasets: [{ label: 'Horas', data: result.serieTemporal.map((item) => item.tempoMedioHoras), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.16)', fill: true, tension: .3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend }, scales: axis } });
    this.distributionChart('status-chart', result.status, ['#38bdf8','#f59e0b','#8b5cf6','#22c55e','#64748b'], text);
    this.distributionChart('priority-chart', result.prioridades, ['#38bdf8','#2563eb','#f59e0b','#ef4444'], text);
    this.addChart('equipment-chart', { type: 'bar', data: { labels: result.tiposEquipamento.map((item) => item.rotulo), datasets: [{ label: 'Atendimentos', data: result.tiposEquipamento.map((item) => item.quantidade), backgroundColor: '#2563eb', borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: axis } });
  }

  private distributionChart(id: string, data: ResultadoIndicativos['status'], colors: string[], text: string): void {
    this.addChart(id, { type: 'doughnut', data: { labels: data.map((item) => item.rotulo), datasets: [{ data: data.map((item) => item.quantidade), backgroundColor: colors, borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: text, usePointStyle: true } } } } });
  }

  private addChart(id: string, config: ConstructorParameters<typeof Chart>[1]): void {
    const context = (this.container.querySelector(`#${id}`) as HTMLCanvasElement | null)?.getContext('2d');
    if (context) this.charts.push(new Chart(context, config));
  }

  private destroyCharts(): void { this.charts.forEach((chart) => chart.destroy()); this.charts = []; }
}
