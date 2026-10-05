import { EquipamentoService } from '../services/equipamentoService';
import { ChamadoService } from '../services/chamadoService';
import { ManutencaoService } from '../services/manutencaoService';
import { UsuarioService } from '../services/usuarioService';
import { FuncionarioService } from '../services/funcionarioService';
import { ChamadosPage } from './chamados';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { formatCurrency, formatDate } from '../utils/formatters';
import { bindDebouncedSearch, escapeHtml as esc } from '../utils/inputBehavior';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { Chamado, StatusChamado } from '../types/chamado';

const stages: Record<StatusChamado, string> = {
  ABERTO: 'Aberta', EM_ATENDIMENTO: 'Em atendimento', AGUARDANDO_USUARIO: 'Aguardando cliente',
  CONCLUIDO: 'Concluída', CANCELADO: 'Cancelada',
};
const active = (order: Chamado) => !['CONCLUIDO', 'CANCELADO'].includes(order.status);

export class DashboardPage {
  private container = document.createElement('div');
  private search = '';
  private status = '';
  private technician = '';
  private priority = '';
  private sort = 'recent';
  private filtersOpen = false;
  private onlyActive = false;
  private currentPage = 1;
  private ordersPage = new ChamadosPage();

  constructor() { this.container.className = 'workshop-page'; }

  public render(): HTMLElement {
    const orders = ChamadoService.getAll();
    const equipment = new Map(EquipamentoService.getAll().map(item => [item.id, item]));
    const clients = new Map(UsuarioService.getAll().map(item => [item.id, item]));
    const team = FuncionarioService.getAll();
    const now = new Date();
    const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).format(now).replace(/ de /g, ' ').replace(/\./g, '').toUpperCase();
    const recent = [...orders].sort((a,b) => b.atualizadoEm.localeCompare(a.atualizadoEm)).slice(0,2);
    const open = orders.filter(active);
    const urgent = open.filter(item => item.prioridade === 'URGENTE');
    const unassigned = open.filter(item => !item.tecnicoResponsavelId && !item.tecnicoResponsavelNomeLegado);
    const waiting = open.filter(item => item.status === 'AGUARDANDO_USUARIO');
    const repairs = ManutencaoService.getAll();
    // Existing total-cost rule, narrowed to repairs created in the local calendar month.
    const monthlyCost = repairs.filter(item => {
      const date = new Date(item.criadoEm);
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }).reduce((sum,item) => sum + (item.custo || 0), 0);
    const query = this.search.trim().toLocaleLowerCase('pt-BR');
    let list = orders.filter(item => (!this.onlyActive || active(item)) && (!this.status || item.status === this.status) &&
      (!this.technician || (this.technician === 'unassigned' ? unassigned.some(order => order.id === item.id) : item.tecnicoResponsavelId === this.technician)) &&
      (!this.priority || item.prioridade === this.priority) &&
      (!query || [item.id, item.titulo, clients.get(item.clienteId)?.nome, equipment.get(item.equipamentoId)?.codigo, equipment.get(item.equipamentoId)?.fabricante, equipment.get(item.equipamentoId)?.modelo].some(value => value?.toLocaleLowerCase('pt-BR').includes(query))));
    list = [...list].sort((a,b) => this.sort === 'oldest' ? a.criadoEm.localeCompare(b.criadoEm) : b.criadoEm.localeCompare(a.criadoEm));
    const totalPages = Math.max(1, Math.ceil(list.length / 6));
    this.currentPage = Math.min(this.currentPage, totalPages);
    const page = calculatePagination(list, this.currentPage, 6);
    const option = (value: string, label: string, selected: string) => `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`;
    const tabs = [['','Todas'],['ABERTO','Abertas'],['EM_ATENDIMENTO','Em atendimento'],['AGUARDANDO_USUARIO','Aguardando']];
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    const days = ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'].map((label,index) => {
      const start = new Date(monday); start.setDate(start.getDate()+index);
      const end = new Date(start); end.setDate(end.getDate()+1);
      return { label, count: orders.filter(item => { const date = new Date(item.criadoEm); return date >= start && date < end; }).length };
    });
    const maximum = Math.max(1,...days.map(day => day.count));
    this.container.innerHTML = `
      <div class="workshop-search-row">
        <label class="workshop-search">${iconHTML('search','',22)}<span class="sr-only">Buscar ordem, cliente ou equipamento</span><input id="workshop-search" type="search" placeholder="Buscar ordem, cliente ou equipamento" value="${esc(this.search)}"></label>
        <button id="workshop-new" class="btn btn-primary">${iconHTML('plus','',24)} Abrir ordem</button>
      </div>
      <section class="workshop-overview" aria-label="Resumo da oficina">
        <div class="workshop-heading"><h1>Oficina</h1><p>${dateLabel}</p></div>
        <dl class="workshop-metrics">
          <div><dt>Ordens ativas</dt><dd>${open.length}</dd></div>
          <div><dt>Em bancada</dt><dd>${repairs.filter(item => item.status === 'EM_ANDAMENTO').length}</dd></div>
          <div><dt>Ordens concluídas</dt><dd>${orders.filter(item => item.status === 'CONCLUIDO').length}</dd></div>
          <div><dt>Custos do mês</dt><dd class="metric-currency">${formatCurrency(monthlyCost)}</dd></div>
        </dl>
      </section>
      <div class="workshop-main-grid">
        <section class="workshop-queue" aria-labelledby="queue-title">
          <div class="workshop-section-heading"><h2 id="queue-title">Fila de trabalho</h2><button id="workshop-filter" class="btn btn-secondary" aria-expanded="${this.filtersOpen}" aria-controls="workshop-filters">${iconHTML('filter','',18)} Filtrar</button></div>
          <div class="workshop-tabs" aria-label="Filtrar por etapa">${tabs.map(([value,label]) => `<button type="button" data-status="${value}" class="${this.status === value ? 'active' : ''}" aria-pressed="${this.status === value}">${label} <span>${value ? orders.filter(item => item.status === value).length : orders.length}</span></button>`).join('')}</div>
          <div id="workshop-filters" class="workshop-filters" ${this.filtersOpen ? '' : 'hidden'}>
            ${this.onlyActive ? '<p class="workshop-filter-note">Exibindo somente ordens ativas.</p>' : ''}
            <label>Responsável<select id="workshop-technician" class="form-control"><option value="">Todos</option>${option('unassigned','Sem responsável',this.technician)}${team.map(item => option(item.id,item.nome,this.technician)).join('')}</select></label>
            <label>Etapa<select id="workshop-status" class="form-control"><option value="">Todas</option>${Object.entries(stages).map(([value,label]) => option(value,label,this.status)).join('')}</select></label>
            <label>Prioridade<select id="workshop-priority" class="form-control"><option value="">Todas</option>${[['BAIXA','Baixa'],['NORMAL','Normal'],['ALTA','Alta'],['URGENTE','Urgente']].map(([v,l]) => option(v,l,this.priority)).join('')}</select></label>
            <label>Ordenação<select id="workshop-sort" class="form-control">${option('recent','Mais recentes',this.sort)}${option('oldest','Mais antigas',this.sort)}</select></label>
            <button id="workshop-clear" class="btn btn-secondary">Limpar filtros</button>
          </div>
          <div class="table-responsive"><table class="workshop-table"><thead><tr><th>Ordem / Cliente</th><th>Equipamento</th><th>Etapa</th><th>Responsável</th><th>Abertura</th><th>Ação</th></tr></thead><tbody>
            ${page.paginatedItems.length ? page.paginatedItems.map(item => {
              const eq = equipment.get(item.equipamentoId);
              const eqLabel = eq ? `${eq.tipo === 'NOTEBOOK' ? 'Notebook' : eq.tipo === 'DESKTOP' ? 'PC' : eq.tipo} ${eq.fabricante} ${eq.modelo}` : 'Equipamento removido';
              return `<tr><td><strong title="${esc(item.id)}">${esc(item.id)}</strong><small>${esc(clients.get(item.clienteId)?.nome ?? 'Cliente removido')}</small></td><td>${esc(eqLabel)}</td><td><span class="workshop-stage stage-${item.status}"><i aria-hidden="true"></i>${stages[item.status]}</span>${item.prioridade === 'URGENTE' ? '<small class="workshop-urgent">Urgente</small>' : ''}</td><td>${esc(item.tecnicoResponsavelId || item.tecnicoResponsavelNomeLegado ? FuncionarioService.resolveName(item.tecnicoResponsavelId,item.tecnicoResponsavelNomeLegado) : 'Sem responsável')}</td><td>${formatDate(item.criadoEm)}</td><td><button class="workshop-link order-action" data-id="${esc(item.id)}" data-action="${active(item) && !item.tecnicoResponsavelId && !item.tecnicoResponsavelNomeLegado ? 'assign' : 'view'}">${active(item) && !item.tecnicoResponsavelId && !item.tecnicoResponsavelNomeLegado ? 'Atribuir' : 'Abrir'} ${iconHTML('arrow-up-right','',16)}<span class="sr-only"> ${esc(item.titulo)}</span></button></td></tr>`;
            }).join('') : '<tr><td colspan="6" class="workshop-empty">Nenhuma ordem encontrada. Ajuste os filtros ou abra uma nova ordem.</td></tr>'}
          </tbody></table></div>
          ${renderPaginationControls(this.currentPage,page.totalPages,page.startItem,page.endItem,page.totalItems)}
        </section>
        <aside class="workshop-aside">
          <section aria-labelledby="attention-title"><h2 id="attention-title">Atenção hoje</h2><ol class="workshop-attention">
            ${[
              urgent.length ? { title:'Ordens urgentes', description:`${urgent.length} atendimento(s) ativo(s) com prioridade urgente`, action:'Ver ordens', filter:'urgent' } : null,
              unassigned.length ? { title:'Sem responsável', description:`${unassigned.length} ordem(ns) aguarda(m) atribuição`, action:'Atribuir técnico', filter:'unassigned' } : null,
              waiting.length ? { title:'Aguardando cliente', description:`${waiting.length} ordem(ns) aguarda(m) retorno`, action:'Ver ordens', filter:'waiting' } : null,
            ].filter(item => item !== null).map((item,index) => `<li><span class="attention-number">${String(index+1).padStart(2,'0')}</span><div><strong>${item!.title}</strong><small>${item!.description}</small></div><button class="workshop-link attention-action" data-filter="${item!.filter}">${item!.action} ${iconHTML('arrow-right','',16)}</button></li>`).join('') || '<li class="workshop-empty">Sem pendências para hoje.</li>'}
          </ol></section>
          <section class="workshop-team"><div class="workshop-section-heading"><h2>Na bancada</h2><a href="#/equipe" class="workshop-link">Ver equipe</a></div><ul>
            ${team.filter(item => item.status === 'ATIVO' && ['TECNICO','SUPERVISOR','ADMINISTRADOR'].includes(item.cargo)).map(item => {
              const count = open.filter(order => order.tecnicoResponsavelId === item.id).length;
              return `<li><i aria-hidden="true"></i><div><strong>${esc(item.nome)}</strong><small>${count} ordem(ns) ativa(s) atribuída(s)</small></div><span>Ativo</span></li>`;
            }).join('') || '<li class="workshop-empty">Nenhum técnico ativo cadastrado.</li>'}
          </ul></section>
        </aside>
      </div>
      <div class="workshop-bottom-grid">
        <section class="workshop-week" aria-labelledby="week-title"><h2 id="week-title">Ritmo da semana</h2><p>Ordens abertas nesta semana · segunda a domingo</p><div class="workshop-bars" role="img" aria-label="${days.map(day => `${day.label}: ${day.count} ordens abertas`).join('; ')}">${days.map(day => `<div><span>${day.count}</span><i style="height:${day.count / maximum * 72}px" aria-hidden="true"></i><small>${day.label}</small></div>`).join('')}</div>${days.every(day => !day.count) ? '<small>Nenhuma ordem aberta nesta semana.</small>' : ''}</section>
        <section class="workshop-updates"><h2>Últimas atualizações</h2><p>Atualização mais recente de cada ordem</p><ul>${recent.map(item => `<li><div><time datetime="${esc(item.atualizadoEm)}">${new Date(item.atualizadoEm).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</time><small>${esc(item.id)}</small></div><div><button class="workshop-link order-action" data-action="view" data-id="${esc(item.id)}">${esc(item.titulo)} · ${stages[item.status]}</button><small>${esc(clients.get(item.clienteId)?.nome ?? 'Cliente removido')}</small></div></li>`).join('') || '<li class="workshop-empty">Nenhuma ordem registrada.</li>'}</ul></section>
      </div>
      <footer class="workshop-footer"><p><strong>TechFix</strong><span>/</span> Oficina organizada, atendimento direto.</p><small>Notebooks e PCs</small></footer>`;
    initIcons(this.container);
    this.attachEvents();
    return this.container;
  }

  private attachEvents(): void {
    bindDebouncedSearch({ input:this.container.querySelector<HTMLInputElement>('#workshop-search')!,root:this.container,selector:'#workshop-search',onValue:value => { this.search=value;this.currentPage=1; },render:()=>this.render() });
    this.container.querySelector('#workshop-new')?.addEventListener('click',()=>this.ordersPage.openFormModal());
    this.container.querySelector('#workshop-filter')?.addEventListener('click',()=> { this.filtersOpen=!this.filtersOpen; this.render(); this.container.querySelector<HTMLElement>(this.filtersOpen ? '#workshop-technician' : '#workshop-filter')?.focus(); });
    this.container.querySelectorAll<HTMLButtonElement>('[data-status]').forEach(button=>button.addEventListener('click',()=> { this.status=button.dataset.status!;this.onlyActive=false;this.currentPage=1;this.render();this.container.querySelector<HTMLElement>(`[data-status="${this.status}"]`)?.focus(); }));
    const selectors = [['workshop-technician','technician'],['workshop-status','status'],['workshop-priority','priority'],['workshop-sort','sort']] as const;
    selectors.forEach(([id,key]) => this.container.querySelector(`#${id}`)?.addEventListener('change',event=> { this[key]=(event.target as HTMLSelectElement).value;this.currentPage=1;this.render();this.container.querySelector<HTMLElement>(`#${id}`)?.focus(); }));
    this.container.querySelector('#workshop-clear')?.addEventListener('click',()=> { this.onlyActive=false;this.search='';this.status='';this.technician='';this.priority='';this.sort='recent';this.currentPage=1;this.render();this.container.querySelector<HTMLElement>('#workshop-clear')?.focus(); });
    this.container.querySelectorAll<HTMLButtonElement>('.order-action').forEach(button => button.addEventListener('click',()=>button.dataset.action === 'assign' ? this.ordersPage.openFormModal(button.dataset.id) : this.ordersPage.openDetailsModal(button.dataset.id!)));
    this.container.querySelectorAll<HTMLButtonElement>('.attention-action').forEach(button => button.addEventListener('click',()=> { this.onlyActive=true;this.status='';this.priority='';this.technician='';this.search='';this.currentPage=1;this.filtersOpen=true;
      if(button.dataset.filter==='urgent') this.priority='URGENTE';
      if(button.dataset.filter==='waiting') this.status='AGUARDANDO_USUARIO';
      if(button.dataset.filter==='unassigned') this.technician='unassigned';
      this.render();this.container.querySelector<HTMLElement>('#queue-title')?.scrollIntoView({block:'start'});this.container.querySelector<HTMLElement>('#workshop-technician')?.focus();
    }));
    this.container.querySelectorAll<HTMLButtonElement>('.pagination-btn[data-page]').forEach(button => button.addEventListener('click',()=> { this.currentPage=Number(button.dataset.page);this.render();this.container.querySelector<HTMLElement>(`.pagination-btn[data-page="${this.currentPage}"]`)?.focus(); }));
  }
}
