import { ConfirmDialog } from '../components/confirmDialog';
import { renderEmptyState } from '../components/emptyState';
import { Modal } from '../components/modal';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { Toast } from '../components/toast';
import { FuncionarioService } from '../services/funcionarioService';
import { CargoFuncionario, CriarFuncionarioDTO, ESPECIALIDADES_FUNCIONARIO, EspecialidadeFuncionario, Funcionario, StatusFuncionario } from '../types/funcionario';
import { downloadCsv } from '../utils/csvExport';
import { formatDate } from '../utils/formatters';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { bindDebouncedSearch, escapeHtml } from '../utils/inputBehavior';

const CARGOS: Record<CargoFuncionario, string> = { ATENDENTE: 'Atendente', TECNICO: 'Técnico', SUPERVISOR: 'Supervisor', ADMINISTRADOR: 'Administrador' };
const ESPECIALIDADES: Record<EspecialidadeFuncionario, string> = { NOTEBOOKS: 'Notebooks', DESKTOPS: 'Desktops', CELULARES: 'Celulares', IMPRESSORAS: 'Impressoras', REDES: 'Redes', SOFTWARE: 'Software', RECUPERACAO_DADOS: 'Recuperação de dados', ELETRONICA: 'Eletrônica', OUTROS: 'Outros' };

export class EquipePage {
  private container = document.createElement('div');
  private search = '';
  private cargo = '';
  private status = '';
  private specialty = '';
  private page = 1;
  private readonly pageSize = 8;
  private sort: keyof Funcionario = 'nome';
  private ascending = true;

  constructor() { this.container.className = 'equipe-page'; }

  public render(): HTMLElement {
    const all = FuncionarioService.getAll();
    let items = [...all];
    const term = this.search.trim().toLowerCase();
    if (term) items = items.filter((item) => [item.nome, item.email, item.telefone, CARGOS[item.cargo], ...item.especialidades.map((value) => ESPECIALIDADES[value])].some((value) => value.toLowerCase().includes(term)));
    if (this.cargo) items = items.filter((item) => item.cargo === this.cargo);
    if (this.status) items = items.filter((item) => item.status === this.status);
    if (this.specialty) items = items.filter((item) => item.especialidades.includes(this.specialty as EspecialidadeFuncionario));
    items.sort((a, b) => String(a[this.sort]).localeCompare(String(b[this.sort]), 'pt-BR') * (this.ascending ? 1 : -1));
    const pagination = calculatePagination(items, this.page, this.pageSize);
    const active = all.filter((item) => item.status === 'ATIVO');

    this.container.innerHTML = `
      <div class="stats-grid team-stats">
        ${this.stat('Total da equipe', all.length, 'users', 'info')}${this.stat('Funcionários ativos', active.length, 'user-check', 'success')}${this.stat('Técnicos ativos', active.filter((item) => item.cargo === 'TECNICO').length, 'wrench', 'accent')}${this.stat('Atendentes ativos', active.filter((item) => item.cargo === 'ATENDENTE').length, 'headphones', 'warning')}
      </div>
      <div class="table-container">
        <div class="table-toolbar"><div class="table-toolbar-left">
          <input id="team-search" class="form-control table-search-input" type="search" placeholder="Pesquisar nome, email, cargo ou especialidade..." value="${escapeHtml(this.search)}" />
          ${this.select('team-cargo', [['','Todos os cargos'], ...Object.entries(CARGOS)], this.cargo)}
          ${this.select('team-status', [['','Todos os status'],['ATIVO','Ativo'],['INATIVO','Inativo']], this.status)}
          ${this.select('team-specialty', [['','Todas as especialidades'], ...Object.entries(ESPECIALIDADES)], this.specialty)}
          ${this.hasFilters() ? `<button id="team-clear" class="btn btn-secondary">${iconHTML('x', '', 16)} Limpar filtros</button>` : ''}
        </div><div class="table-toolbar-right"><button id="team-export" class="btn btn-secondary">${iconHTML('download', '', 16)} Exportar CSV</button><button id="team-add" class="btn btn-primary">${iconHTML('user-plus', '', 17)} Novo funcionário</button></div></div>
        <div class="table-responsive">${pagination.totalItems === 0 ? renderEmptyState('Nenhum funcionário cadastrado', 'Cadastre os membros da equipe para atribuí-los às ordens de serviço e aos reparos.', 'users') : `<table class="data-table"><thead><tr><th class="sortable" data-sort="nome">Nome</th><th>Contato</th><th class="sortable" data-sort="cargo">Cargo</th><th>Especialidades</th><th>Status</th><th>Ordens</th><th style="text-align:right">Ações</th></tr></thead><tbody>${pagination.paginatedItems.map((item) => this.row(item)).join('')}</tbody></table>`}</div>
        ${pagination.totalItems === 0 ? '<div class="empty-state-action"><button id="team-first" class="btn btn-primary">Cadastrar primeiro funcionário</button></div>' : renderPaginationControls(this.page, pagination.totalPages, pagination.startItem, pagination.endItem, pagination.totalItems)}
      </div>`;
    initIcons(this.container); this.attachEvents(); return this.container;
  }

  private stat(label: string, value: number, icon: string, variant: string): string { return `<article class="card stat-card ${variant}"><div class="stat-info"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div><div class="stat-icon ${variant === 'accent' ? 'teal' : variant}">${iconHTML(icon, '', 22)}</div></article>`; }
  private select(id: string, options: string[][], selected: string): string { return `<select id="${id}" class="form-control team-filter">${options.map(([value,label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('')}</select>`; }
  private hasFilters(): boolean { return !!(this.search || this.cargo || this.status || this.specialty); }
  private row(item: Funcionario): string { const links = FuncionarioService.getLinkCounts(item.id); return `<tr><td><strong>${escapeHtml(item.nome)}</strong><div class="table-cell-note">${escapeHtml(item.telefone || 'Sem telefone')}</div></td><td><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></td><td><span class="badge badge-info">${CARGOS[item.cargo]}</span></td><td><div class="specialty-list">${item.especialidades.length ? item.especialidades.map((value) => `<span class="badge badge-neutral">${ESPECIALIDADES[value]}</span>`).join('') : '<span class="table-cell-note">Não informadas</span>'}</div></td><td><span class="badge ${item.status === 'ATIVO' ? 'badge-success' : 'badge-neutral'}">${item.status === 'ATIVO' ? 'Ativo' : 'Inativo'}</span></td><td>${links.ordens}</td><td style="text-align:right"><div class="table-actions" style="justify-content:flex-end"><button class="btn-icon team-view" data-id="${item.id}" aria-label="Visualizar ${escapeHtml(item.nome)}">${iconHTML('eye', '', 17)}</button><button class="btn-icon team-edit" data-id="${item.id}" aria-label="Editar ${escapeHtml(item.nome)}">${iconHTML('edit-3', '', 17)}</button><button class="btn-icon team-toggle" data-id="${item.id}" aria-label="${item.status === 'ATIVO' ? 'Inativar' : 'Ativar'} ${escapeHtml(item.nome)}" style="color:var(--${item.status === 'ATIVO' ? 'warning' : 'success'})">${iconHTML(item.status === 'ATIVO' ? 'user-x' : 'user-check', '', 17)}</button><button class="btn-icon team-delete" data-id="${item.id}" aria-label="Excluir ${escapeHtml(item.nome)}" style="color:var(--danger)">${iconHTML('trash-2', '', 17)}</button></div></td></tr>`; }

  private attachEvents(): void {
    const search = this.container.querySelector<HTMLInputElement>('#team-search'); if (search) bindDebouncedSearch({ input: search, root: this.container, selector: '#team-search', onValue: (value) => { this.search = value; this.page = 1; }, render: () => this.render() });
    [['team-cargo','cargo'],['team-status','status'],['team-specialty','specialty']].forEach(([id,key]) => this.container.querySelector(`#${id}`)?.addEventListener('change', (event) => { (this as unknown as Record<string,string>)[key] = (event.target as HTMLSelectElement).value; this.page = 1; this.render(); }));
    const reset = (): void => { this.search = ''; this.cargo = ''; this.status = ''; this.specialty = ''; this.page = 1; this.render(); };
    this.container.querySelector('#team-clear')?.addEventListener('click', reset);
    this.container.querySelector('#team-add')?.addEventListener('click', () => this.openForm()); this.container.querySelector('#team-first')?.addEventListener('click', () => this.openForm());
    this.container.querySelector('#team-export')?.addEventListener('click', () => this.exportCsv());
    this.container.querySelectorAll('.pagination-btn[data-page]').forEach((button) => button.addEventListener('click', () => { this.page = Number(button.getAttribute('data-page') ?? 1); this.render(); }));
    this.container.querySelectorAll('.sortable').forEach((element) => element.addEventListener('click', () => { const field = element.getAttribute('data-sort') as keyof Funcionario; if (field === this.sort) this.ascending = !this.ascending; else { this.sort = field; this.ascending = true; } this.render(); }));
    this.container.querySelectorAll('.team-view').forEach((button) => button.addEventListener('click', () => this.openDetails(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.team-edit').forEach((button) => button.addEventListener('click', () => this.openForm(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.team-toggle').forEach((button) => button.addEventListener('click', () => this.toggle(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.team-delete').forEach((button) => button.addEventListener('click', () => this.remove(button.getAttribute('data-id')!)));
  }

  private openForm(id?: string): void {
    const item = id ? FuncionarioService.getById(id) : undefined;
    const form = document.createElement('form'); form.className = 'team-form';
    form.innerHTML = `<div class="form-grid"><div class="form-group"><label class="form-label">Nome completo <span class="required">*</span></label><input name="nome" class="form-control" required value="${escapeHtml(item?.nome)}" /></div><div class="form-group"><label class="form-label">Email <span class="required">*</span></label><input name="email" type="email" class="form-control" required value="${escapeHtml(item?.email)}" /></div><div class="form-group"><label class="form-label">Telefone</label><input name="telefone" type="tel" class="form-control" value="${escapeHtml(item?.telefone)}" /></div><div class="form-group"><label class="form-label">Cargo <span class="required">*</span></label>${this.selectForm('cargo', Object.entries(CARGOS), item?.cargo ?? 'TECNICO')}</div><div class="form-group"><label class="form-label">Status <span class="required">*</span></label>${this.selectForm('status', [['ATIVO','Ativo'],['INATIVO','Inativo']], item?.status ?? 'ATIVO')}</div><fieldset class="form-group form-grid-full specialty-fieldset"><legend class="form-label">Especialidades</legend><div class="checkbox-grid">${ESPECIALIDADES_FUNCIONARIO.map((value) => `<label class="checkbox-option"><input type="checkbox" name="especialidades" value="${value}" ${item?.especialidades.includes(value) ? 'checked' : ''}/><span>${ESPECIALIDADES[value]}</span></label>`).join('')}</div></fieldset><div class="form-group form-grid-full"><label class="form-label">Observações</label><textarea name="observacoes" class="form-control">${escapeHtml(item?.observacoes)}</textarea></div></div>`;
    const modal = new Modal({ title: item ? 'Editar funcionário' : 'Cadastrar funcionário', content: form, footerButtons: [{ text:'Cancelar', class:'btn-secondary', onClick:(m) => m.close() }, { text:item ? 'Salvar alterações' : 'Salvar funcionário', class:'btn-primary', onClick:(m) => { const data = new FormData(form); const dto: CriarFuncionarioDTO = { nome:String(data.get('nome') ?? ''), email:String(data.get('email') ?? ''), telefone:String(data.get('telefone') ?? ''), cargo:String(data.get('cargo')) as CargoFuncionario, especialidades:data.getAll('especialidades') as EspecialidadeFuncionario[], status:String(data.get('status')) as StatusFuncionario, observacoes:String(data.get('observacoes') ?? '') }; try { if (item) { FuncionarioService.update(item.id, dto); Toast.success('Funcionário atualizado com sucesso.'); } else { FuncionarioService.create(dto); Toast.success('Funcionário cadastrado com sucesso.'); } m.close(); } catch (error) { Toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o funcionário.'); } } }] }); modal.open();
  }

  private selectForm(name: string, options: string[][], selected: string): string { return `<select name="${name}" class="form-control" required>${options.map(([value,label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('')}</select>`; }
  private openDetails(id: string): void { const item = FuncionarioService.getById(id); if (!item) return; const links = FuncionarioService.getLinkCounts(id); new Modal({ title:'Detalhes do funcionário', content:`<div class="detail-grid"><div class="detail-section"><strong>Nome</strong><p>${escapeHtml(item.nome)}</p></div><div class="detail-section"><strong>Status</strong><p>${item.status === 'ATIVO' ? 'Ativo' : 'Inativo'}</p></div><div class="detail-section"><strong>Email</strong><p>${escapeHtml(item.email)}</p></div><div class="detail-section"><strong>Telefone</strong><p>${escapeHtml(item.telefone || '-')}</p></div><div class="detail-section"><strong>Cargo</strong><p>${CARGOS[item.cargo]}</p></div><div class="detail-section"><strong>Registros vinculados</strong><p>${links.ordens} ordem(ns), ${links.reparos} reparo(s)</p></div><div class="detail-section form-grid-full"><strong>Especialidades</strong><p>${item.especialidades.map((value) => ESPECIALIDADES[value]).join(', ') || 'Não informadas'}</p></div><div class="detail-section form-grid-full"><strong>Observações</strong><p>${escapeHtml(item.observacoes || '-')}</p></div></div>` }).open(); }
  private toggle(id: string): void { const item = FuncionarioService.getById(id); if (!item) return; const activating = item.status === 'INATIVO'; ConfirmDialog.show({ title:activating ? 'Ativar funcionário' : 'Inativar funcionário', message:`Deseja ${activating ? 'ativar' : 'inativar'} <strong>${escapeHtml(item.nome)}</strong>?`, confirmText:activating ? 'Ativar' : 'Inativar', confirmVariant:activating ? 'primary' : 'danger', onConfirm:() => { FuncionarioService.setActive(id, activating); Toast.success(`Funcionário ${activating ? 'ativado' : 'inativado'} com sucesso.`); } }); }
  private remove(id: string): void { const item = FuncionarioService.getById(id); if (!item) return; const links = FuncionarioService.getLinkCounts(id); if (links.total) { ConfirmDialog.show({ title:'Funcionário com histórico vinculado', message:'Este funcionário possui registros vinculados e não pode ser excluído definitivamente. Você pode inativá-lo para impedir novas atribuições.', confirmText:'Inativar funcionário', confirmVariant:'danger', onConfirm:() => { FuncionarioService.setActive(id, false); Toast.success('Funcionário inativado com sucesso.'); } }); return; } ConfirmDialog.show({ title:'Excluir funcionário', message:`Excluir definitivamente <strong>${escapeHtml(item.nome)}</strong>?`, confirmText:'Excluir', confirmVariant:'danger', onConfirm:() => { FuncionarioService.delete(id); Toast.success('Funcionário excluído com sucesso.'); } }); }
  private exportCsv(): void { const items = FuncionarioService.getAll(); if (!items.length) { Toast.info('Não existem funcionários para exportar.'); return; } downloadCsv(`techfix-equipe-${new Date().toISOString().slice(0,10)}.csv`, ['Nome','Email','Telefone','Cargo','Especialidades','Status','Data de cadastro'], items.map((item) => [item.nome,item.email,item.telefone,CARGOS[item.cargo],item.especialidades.map((value) => ESPECIALIDADES[value]).join(', '),item.status,formatDate(item.criadoEm)])); Toast.success(`${items.length} funcionário(s) exportado(s).`); }
}
