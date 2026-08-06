import { ChamadoService } from '../services/chamadoService';
import { UsuarioService } from '../services/usuarioService';
import { EquipamentoService } from '../services/equipamentoService';
import { FuncionarioService } from '../services/funcionarioService';
import { CriarChamadoDTO, PrioridadeChamado, StatusChamado } from '../types/chamado';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { formatDateTime, getPrioridadeChamadoBadge, getStatusChamadoBadge } from '../utils/formatters';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { renderEmptyState } from '../components/emptyState';
import { Modal } from '../components/modal';
import { ConfirmDialog } from '../components/confirmDialog';
import { Toast } from '../components/toast';
import { bindDebouncedSearch, escapeHtml } from '../utils/inputBehavior';

export class ChamadosPage {
  private container = document.createElement('div');
  private searchKeyword = '';
  private filterStatus = '';
  private filterPrioridade = '';
  private filterTecnico = '';
  private filterCliente = '';
  private filterEquipamento = '';
  private currentPage = 1;

  constructor() { this.container.className = 'chamados-page'; }

  public render(): HTMLElement {
    const users = new Map(UsuarioService.getAll().map((item) => [item.id, item]));
    const equipments = new Map(EquipamentoService.getAll().map((item) => [item.id, item]));
    let list = ChamadoService.getAll();
    const term = this.searchKeyword.trim().toLowerCase();
    if (term) list = list.filter((item) => [item.id, item.titulo, item.descricao, users.get(item.clienteId)?.nome, equipments.get(item.equipamentoId)?.codigo, FuncionarioService.resolveName(item.tecnicoResponsavelId, item.tecnicoResponsavelNomeLegado)].some((value) => value?.toLowerCase().includes(term)));
    if (this.filterStatus) list = list.filter((item) => item.status === this.filterStatus);
    if (this.filterPrioridade) list = list.filter((item) => item.prioridade === this.filterPrioridade);
    if (this.filterTecnico) list = list.filter((item) => item.tecnicoResponsavelId === this.filterTecnico);
    if (this.filterCliente) list = list.filter((item) => item.clienteId === this.filterCliente);
    if (this.filterEquipamento) list = list.filter((item) => item.equipamentoId === this.filterEquipamento);
    const page = calculatePagination(list, this.currentPage, 8);
    const option = (value: string, label: string, selected: string) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    this.container.innerHTML = `<div class="table-container"><div class="table-toolbar"><div class="table-toolbar-left">
      <input id="search-input" class="form-control table-search-input" placeholder="Pesquisar ordens..." value="${escapeHtml(this.searchKeyword)}">
      <select id="filter-status" class="form-control"><option value="">Todos os status</option>${[['ABERTO','Aberta'],['EM_ATENDIMENTO','Em atendimento'],['AGUARDANDO_USUARIO','Aguardando cliente'],['CONCLUIDO','Concluída'],['CANCELADO','Cancelada']].map(([v,l]) => option(v,l,this.filterStatus)).join('')}</select>
      <select id="filter-prioridade" class="form-control"><option value="">Todas as prioridades</option>${[['BAIXA','Baixa'],['NORMAL','Normal'],['ALTA','Alta'],['URGENTE','Urgente']].map(([v,l]) => option(v,l,this.filterPrioridade)).join('')}</select>
      <select id="filter-cliente" class="form-control"><option value="">Todos os clientes</option>${[...users.values()].map((u) => option(u.id,u.nome,this.filterCliente)).join('')}</select>
      <select id="filter-equipamento" class="form-control"><option value="">Todos os equipamentos</option>${[...equipments.values()].map((e) => option(e.id,`${e.codigo} — ${e.modelo}`,this.filterEquipamento)).join('')}</select>
      <select id="filter-tecnico" class="form-control"><option value="">Todos os técnicos</option>${FuncionarioService.getAll().map((f) => option(f.id,f.nome,this.filterTecnico)).join('')}</select>
      ${this.hasFilters() ? `<button id="clear-filters-btn" class="btn btn-secondary">${iconHTML('x','',16)} Limpar</button>` : ''}
    </div><button id="add-chamado-btn" class="btn btn-primary">${iconHTML('plus','',18)} Nova ordem</button></div>
    <div class="table-responsive">${page.paginatedItems.length ? `<table class="data-table"><thead><tr><th>Ordem</th><th>Cliente</th><th>Equipamento</th><th>Prioridade</th><th>Técnico</th><th>Status</th><th>Ações</th></tr></thead><tbody>${page.paginatedItems.map((item) => `<tr><td><strong>${escapeHtml(item.titulo)}</strong><small style="display:block">${escapeHtml(item.id)}</small></td><td>${escapeHtml(users.get(item.clienteId)?.nome ?? 'Cliente removido')}</td><td>${escapeHtml(equipments.get(item.equipamentoId)?.codigo ?? 'Equipamento removido')}</td><td>${getPrioridadeChamadoBadge(item.prioridade)}</td><td>${escapeHtml(FuncionarioService.resolveName(item.tecnicoResponsavelId,item.tecnicoResponsavelNomeLegado))}</td><td>${getStatusChamadoBadge(item.status)}</td><td><div class="table-actions"><button class="btn-icon view-btn" data-id="${item.id}">${iconHTML('eye','',18)}</button><button class="btn-icon edit-btn" data-id="${item.id}">${iconHTML('edit-3','',18)}</button><button class="btn-icon delete-btn" data-id="${item.id}">${iconHTML('trash-2','',18)}</button></div></td></tr>`).join('')}</tbody></table>` : renderEmptyState('Nenhuma ordem encontrada','Ajuste os filtros ou crie uma nova ordem.','ticket')}</div>
    ${renderPaginationControls(this.currentPage,page.totalPages,page.startItem,page.endItem,page.totalItems)}</div>`;
    initIcons(this.container); this.attachEvents(); return this.container;
  }

  private hasFilters(): boolean { return Boolean(this.searchKeyword || this.filterStatus || this.filterPrioridade || this.filterTecnico || this.filterCliente || this.filterEquipamento); }
  private attachEvents(): void {
    const search = this.container.querySelector('#search-input') as HTMLInputElement;
    bindDebouncedSearch({ input: search, root: this.container, selector: '#search-input', onValue: (value) => { this.searchKeyword = value; this.currentPage = 1; }, render: () => this.render() });
    [['filter-status','filterStatus'],['filter-prioridade','filterPrioridade'],['filter-tecnico','filterTecnico'],['filter-cliente','filterCliente'],['filter-equipamento','filterEquipamento']].forEach(([id,key]) => this.container.querySelector(`#${id}`)?.addEventListener('change',(event) => { (this as unknown as Record<string,string>)[key] = (event.target as HTMLSelectElement).value; this.currentPage=1; this.render(); }));
    this.container.querySelector('#clear-filters-btn')?.addEventListener('click',() => { this.searchKeyword=''; this.filterStatus=''; this.filterPrioridade=''; this.filterTecnico=''; this.filterCliente=''; this.filterEquipamento=''; this.currentPage=1; this.render(); });
    this.container.querySelector('#add-chamado-btn')?.addEventListener('click',() => this.openFormModal());
    this.container.querySelectorAll('.view-btn').forEach((button) => button.addEventListener('click',() => this.openDetailsModal(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.edit-btn').forEach((button) => button.addEventListener('click',() => this.openFormModal(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.delete-btn').forEach((button) => button.addEventListener('click',() => this.confirmDelete(button.getAttribute('data-id')!)));
    this.container.querySelectorAll('.pagination-btn[data-page]').forEach((button) => button.addEventListener('click',() => { this.currentPage=Number(button.getAttribute('data-page')); this.render(); }));
  }

  private openFormModal(id?: string): void {
    const item = id ? ChamadoService.getById(id) : undefined;
    const clients = UsuarioService.getAll().filter((user) => user.status === 'ATIVO' || user.id === item?.clienteId);
    const technicians = FuncionarioService.getAssignable(); const current = item?.tecnicoResponsavelId ? FuncionarioService.getById(item.tecnicoResponsavelId) : undefined;
    if (current && !technicians.some((tech) => tech.id === current.id)) technicians.push(current);
    const form = document.createElement('form'); form.className='chamado-form';
    form.innerHTML = `<div class="form-grid"><div class="form-group form-grid-full"><label class="form-label">Título <span class="required">*</span></label><input name="titulo" class="form-control" value="${escapeHtml(item?.titulo)}" required></div><div class="form-group form-grid-full"><label class="form-label">Descrição <span class="required">*</span></label><textarea name="descricao" class="form-control" required>${escapeHtml(item?.descricao)}</textarea></div>
      <div class="form-group"><label class="form-label">Cliente <span class="required">*</span></label><select name="clienteId" id="order-client" class="form-control" required><option value="">Selecione...</option>${clients.map((u)=>`<option value="${u.id}" ${u.id===item?.clienteId?'selected':''}>${escapeHtml(u.nome)}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Equipamento <span class="required">*</span></label><select name="equipamentoId" id="order-equipment" class="form-control" required></select><small id="equipment-help"></small></div>
      <div class="form-group"><label class="form-label">Prioridade</label><select name="prioridade" class="form-control">${[['BAIXA','Baixa'],['NORMAL','Normal'],['ALTA','Alta'],['URGENTE','Urgente']].map(([v,l])=>`<option value="${v}" ${v===(item?.prioridade??'NORMAL')?'selected':''}>${l}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Status</label><select name="status" class="form-control">${[['ABERTO','Aberta'],['EM_ATENDIMENTO','Em atendimento'],['AGUARDANDO_USUARIO','Aguardando cliente'],['CONCLUIDO','Concluída'],['CANCELADO','Cancelada']].map(([v,l])=>`<option value="${v}" ${v===(item?.status??'ABERTO')?'selected':''}>${l}</option>`).join('')}</select></div>
      <div class="form-group form-grid-full"><label class="form-label">Técnico responsável</label><select name="tecnicoResponsavelId" class="form-control"><option value="">${technicians.length ? 'Não atribuído' : 'Nenhum técnico ativo cadastrado'}</option>${technicians.map((f)=>`<option value="${f.id}" ${f.id===item?.tecnicoResponsavelId?'selected':''}>${escapeHtml(f.nome)} — ${escapeHtml(f.cargo)}</option>`).join('')}</select>${technicians.length ? '' : '<small><a href="#/equipe">Cadastrar membro da equipe</a></small>'}</div></div>`;
    const clientSelect=form.querySelector('#order-client') as HTMLSelectElement; const equipmentSelect=form.querySelector('#order-equipment') as HTMLSelectElement; const help=form.querySelector('#equipment-help')!;
    const fillEquipment=()=>{ const available=EquipamentoService.getAll().filter((e)=>e.clienteId===clientSelect.value); equipmentSelect.disabled=!clientSelect.value; equipmentSelect.innerHTML=`<option value="">Selecione...</option>${available.map((e)=>`<option value="${e.id}" ${e.id===item?.equipamentoId?'selected':''}>${escapeHtml(e.codigo)} — ${escapeHtml(e.fabricante)} ${escapeHtml(e.modelo)}</option>`).join('')}`; help.innerHTML=clientSelect.value&&!available.length?'Este cliente não possui equipamentos. <a href="#/equipamentos">Cadastrar equipamento</a>':''; }; clientSelect.addEventListener('change',fillEquipment); fillEquipment();
    const modal=new Modal({title:item?'Editar ordem':'Nova ordem',content:form,footerButtons:[{text:'Cancelar',class:'btn-secondary',onClick:(m)=>m.close()},{text:'Salvar',class:'btn-primary',onClick:(m)=>{const data=new FormData(form); const dto:CriarChamadoDTO={titulo:String(data.get('titulo')??''),descricao:String(data.get('descricao')??''),clienteId:String(data.get('clienteId')??''),equipamentoId:String(data.get('equipamentoId')??''),prioridade:data.get('prioridade') as PrioridadeChamado,status:data.get('status') as StatusChamado,tecnicoResponsavelId:String(data.get('tecnicoResponsavelId')??'')||null}; try { item?ChamadoService.update(item.id,dto):ChamadoService.create(dto); Toast.success('Ordem salva com sucesso.'); m.close(); } catch(error){Toast.error(error instanceof Error?error.message:'Não foi possível salvar.');}}}]}); modal.open();
  }
  private openDetailsModal(id:string):void { const item=ChamadoService.getById(id); if(!item)return; const client=UsuarioService.getById(item.clienteId); const equipment=EquipamentoService.getById(item.equipamentoId); new Modal({title:'Detalhes da ordem',content:`<div class="details-grid"><div><strong>Ordem:</strong> ${escapeHtml(item.id)}</div><div><strong>Cliente:</strong> ${escapeHtml(client?.nome??'Cliente removido')}</div><div><strong>Equipamento:</strong> ${escapeHtml(equipment?`${equipment.codigo} — ${equipment.fabricante} ${equipment.modelo}`:'Equipamento removido')}</div><div><strong>Técnico:</strong> ${escapeHtml(FuncionarioService.resolveName(item.tecnicoResponsavelId,item.tecnicoResponsavelNomeLegado))}</div><div><strong>Abertura:</strong> ${formatDateTime(item.criadoEm)}</div><div>${getStatusChamadoBadge(item.status)}</div><div style="grid-column:1/-1"><strong>Descrição:</strong><p>${escapeHtml(item.descricao)}</p></div></div>`}).open(); }
  private confirmDelete(id:string):void { const item=ChamadoService.getById(id); if(!item)return; ConfirmDialog.show({title:'Excluir ordem',message:`Excluir <strong>${escapeHtml(item.titulo)}</strong>?`,confirmText:'Excluir',confirmVariant:'danger',onConfirm:()=>{ChamadoService.delete(id);Toast.success('Ordem excluída.');}}); }
}
