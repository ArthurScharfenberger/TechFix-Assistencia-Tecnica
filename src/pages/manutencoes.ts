import { ManutencaoService } from '../services/manutencaoService';
import { EquipamentoService } from '../services/equipamentoService';
import { FuncionarioService } from '../services/funcionarioService';
import { StatusManutencao, CriarManutencaoDTO } from '../types/manutencao';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { getStatusManutencaoBadge, formatCurrency, formatDate } from '../utils/formatters';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { renderEmptyState } from '../components/emptyState';
import { Modal } from '../components/modal';
import { ConfirmDialog } from '../components/confirmDialog';
import { Toast } from '../components/toast';
import { bindDebouncedSearch, escapeHtml } from '../utils/inputBehavior';

export class ManutencoesPage {
  private container: HTMLElement;
  private searchKeyword: string = '';
  private filterStatus: string = '';
  private filterEquipamentoId: string = '';
  private filterTecnicoId: string = '';
  private currentPage: number = 1;
  private pageSize: number = 8;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'manutencoes-page';
  }

  public render(): HTMLElement {
    let list = ManutencaoService.getAll();

    // Search
    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.descricao.toLowerCase().includes(kw) ||
          FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado).toLowerCase().includes(kw) ||
          m.id.toLowerCase().includes(kw)
      );
    }

    if (this.filterStatus) {
      list = list.filter((m) => m.status === this.filterStatus);
    }

    if (this.filterEquipamentoId) {
      list = list.filter((m) => m.equipamentoId === this.filterEquipamentoId);
    }
    if (this.filterTecnicoId) list = list.filter((m) => m.tecnicoResponsavelId === this.filterTecnicoId);

    const { paginatedItems, totalPages, startItem, endItem, totalItems } = calculatePagination(
      list,
      this.currentPage,
      this.pageSize
    );

    const custoTotalFiltrado = list.reduce((acc, m) => acc + (m.custo || 0), 0);
    const todosEquipamentos = EquipamentoService.getAll();

    this.container.innerHTML = `
      <!-- Total Cost Header Banner -->
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: var(--radius-lg); flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="stat-icon amber">${iconHTML('wrench', '', 24)}</div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Custo Total Acumulado</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-warning);">${formatCurrency(custoTotalFiltrado)}</div>
          </div>
        </div>

        <button id="add-manutencao-btn" class="btn btn-primary">
          ${iconHTML('plus', '', 18)} Registrar reparo
        </button>
      </div>

      <div class="table-container">
        <!-- Toolbar & Filters -->
        <div class="table-toolbar">
          <div class="table-toolbar-left">
            <input
              type="text"
              id="search-input"
              class="form-control table-search-input"
              placeholder="Pesquisar por descrição, técnico..."
              value="${escapeHtml(this.searchKeyword)}"
            />

            <select id="filter-status" class="form-control" style="width: auto;">
              <option value="">Todos os Status</option>
              <option value="AGENDADA" ${this.filterStatus === 'AGENDADA' ? 'selected' : ''}>Agendada</option>
              <option value="EM_ANDAMENTO" ${this.filterStatus === 'EM_ANDAMENTO' ? 'selected' : ''}>Em Andamento</option>
              <option value="CONCLUIDA" ${this.filterStatus === 'CONCLUIDA' ? 'selected' : ''}>Concluída</option>
              <option value="CANCELADA" ${this.filterStatus === 'CANCELADA' ? 'selected' : ''}>Cancelada</option>
            </select>

            <select id="filter-equipamento" class="form-control" style="width: auto;">
              <option value="">Todos os Equipamentos</option>
              ${todosEquipamentos
                .map((eq) => `<option value="${escapeHtml(eq.id)}" ${this.filterEquipamentoId === eq.id ? 'selected' : ''}>${escapeHtml(eq.modelo)} (${escapeHtml(eq.codigo)})</option>`)
                .join('')}
            </select>
            <select id="filter-tecnico" class="form-control" style="width: auto;">
              <option value="">Todos os técnicos</option>
              ${FuncionarioService.getAll().map((item) => `<option value="${escapeHtml(item.id)}" ${this.filterTecnicoId === item.id ? 'selected' : ''}>${escapeHtml(item.nome)}</option>`).join('')}
            </select>

            ${
              this.searchKeyword || this.filterStatus || this.filterEquipamentoId || this.filterTecnicoId
                ? `<button id="clear-filters-btn" class="btn btn-secondary" style="padding: 0.5rem 0.75rem;">${iconHTML('x', '', 16)} Limpar Filtros</button>`
                : ''
            }
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive">
          ${
            paginatedItems.length === 0
              ? renderEmptyState('Nenhum reparo encontrado', 'Altere os filtros ou registre um novo serviço.', 'wrench')
              : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Equipamento</th>
                    <th>Descrição</th>
                    <th>Técnico Responsável</th>
                    <th>Data Início</th>
                    <th>Custo</th>
                    <th>Status</th>
                    <th style="text-align: right;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedItems
                    .map((m) => {
                      const eq = EquipamentoService.getById(m.equipamentoId);
                      const isEmAndamento = m.status === 'EM_ANDAMENTO' || m.status === 'AGENDADA';
                      return `
                        <tr>
                          <td>
                            <div style="font-weight: 700; color: var(--text-main);">${eq ? eq.modelo : 'N/A'}</div>
                            <div style="font-size: 0.775rem; color: var(--accent-primary); font-weight: 600;">${eq ? escapeHtml(eq.codigo) : 'N/A'}</div>
                          </td>
                          <td style="max-width: 250px;">
                            <div style="font-size: 0.875rem; color: var(--text-main);">${m.descricao}</div>
                          </td>
                          <td>${FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado)}</td>
                          <td>${formatDate(m.dataInicio)}</td>
                          <td style="font-weight: 700; color: var(--color-warning);">${formatCurrency(m.custo)}</td>
                          <td>${getStatusManutencaoBadge(m.status)}</td>
                          <td style="text-align: right;">
                            <div class="table-actions" style="justify-content: flex-end;">
                              ${
                                isEmAndamento
                                  ? `<button class="btn-icon finish-btn" data-id="${m.id}" title="Concluir reparo" aria-label="Concluir reparo ${m.id}" style="color: var(--color-success);">${iconHTML('check-circle', '', 18)}</button>`
                                  : ''
                              }
                              <button class="btn-icon view-btn" data-id="${m.id}" title="Detalhes">${iconHTML('eye', '', 18)}</button>
                              <button class="btn-icon edit-btn" data-id="${m.id}" title="Editar">${iconHTML('edit-3', '', 18)}</button>
                              <button class="btn-icon delete-btn" data-id="${m.id}" title="Excluir" style="color: var(--color-danger);">${iconHTML('trash-2', '', 18)}</button>
                            </div>
                          </td>
                        </tr>
                      `;
                    })
                    .join('')}
                </tbody>
              </table>
            `
          }
        </div>

        ${renderPaginationControls(this.currentPage, totalPages, startItem, endItem, totalItems)}
      </div>
    `;

    initIcons(this.container);
    this.attachEvents();
    return this.container;
  }

  private attachEvents(): void {
    const searchInput = this.container.querySelector('#search-input') as HTMLInputElement;
    if (searchInput) {
      bindDebouncedSearch({
        input: searchInput,
        root: this.container,
        selector: '#search-input',
        onValue: (value) => { this.searchKeyword = value; this.currentPage = 1; },
        render: () => { this.render(); },
      });
    }

    const selectStatus = this.container.querySelector('#filter-status') as HTMLSelectElement;
    if (selectStatus) {
      selectStatus.addEventListener('change', () => {
        this.filterStatus = selectStatus.value;
        this.currentPage = 1;
        this.render();
      });
    }

    const selectEquipamento = this.container.querySelector('#filter-equipamento') as HTMLSelectElement;
    if (selectEquipamento) {
      selectEquipamento.addEventListener('change', () => {
        this.filterEquipamentoId = selectEquipamento.value;
        this.currentPage = 1;
        this.render();
      });
    }
    const selectTecnico = this.container.querySelector('#filter-tecnico') as HTMLSelectElement;
    selectTecnico?.addEventListener('change', () => { this.filterTecnicoId = selectTecnico.value; this.currentPage = 1; this.render(); });

    const clearBtn = this.container.querySelector('#clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchKeyword = '';
        this.filterStatus = '';
        this.filterEquipamentoId = '';
        this.filterTecnicoId = '';
        this.currentPage = 1;
        this.render();
      });
    }

    this.container.querySelectorAll('.pagination-btn[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-page') || '1', 10);
        if (!isNaN(page)) {
          this.currentPage = page;
          this.render();
        }
      });
    });

    const addBtn = this.container.querySelector('#add-manutencao-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openFormModal());
    }

    this.container.querySelectorAll('.finish-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) this.concluirManutencao(id);
      });
    });

    this.container.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) this.openDetailsModal(id);
      });
    });

    this.container.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) this.openFormModal(id);
      });
    });

    this.container.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) this.confirmDelete(id);
      });
    });
  }

  private openFormModal(idEdicao?: string): void {
    const isEdit = !!idEdicao;
    const item = isEdit ? ManutencaoService.getById(idEdicao!) : null;
    const equipamentosValidos = EquipamentoService.getAll().filter((eq) => eq.status !== 'DESCARTADO' || (item && item.equipamentoId === eq.id));
    const tecnicos = FuncionarioService.getAssignable();
    const tecnicoAtual = item?.tecnicoResponsavelId ? FuncionarioService.getById(item.tecnicoResponsavelId) : null;
    if (tecnicoAtual && !tecnicos.some((tecnico) => tecnico.id === tecnicoAtual.id)) tecnicos.push(tecnicoAtual);

    const formContent = document.createElement('form');
    formContent.className = 'manutencao-form';
    formContent.innerHTML = `
      <div class="form-grid">
        <div class="form-group form-grid-full">
          <label class="form-label">Equipamento <span class="required">*</span></label>
          <select name="equipamentoId" class="form-control" required>
            <option value="">Selecione o equipamento...</option>
            ${equipamentosValidos
              .map(
                (eq) =>
                  `<option value="${escapeHtml(eq.id)}" ${item && item.equipamentoId === eq.id ? 'selected' : ''}>${escapeHtml(eq.modelo)} (${escapeHtml(eq.codigo)})</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="form-group form-grid-full">
          <label class="form-label">Descrição do Serviço <span class="required">*</span></label>
          <textarea name="descricao" class="form-control" placeholder="Descreva os procedimentos ou defeito reportado..." required>${escapeHtml(item?.descricao)}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Técnico responsável</label>
          <select name="tecnicoResponsavelId" class="form-control">
            <option value="">${tecnicos.length ? 'Não atribuído' : 'Nenhum técnico ativo cadastrado'}</option>
            ${tecnicos.map((tecnico) => `<option value="${escapeHtml(tecnico.id)}" ${item?.tecnicoResponsavelId === tecnico.id ? 'selected' : ''}>${escapeHtml(tecnico.nome)} — ${escapeHtml(tecnico.cargo)}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Custo Estimado/Final (R$) <span class="required">*</span></label>
          <input type="number" name="custo" step="0.01" min="0" class="form-control" placeholder="0.00" value="${item ? item.custo : '0.00'}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Data de Início <span class="required">*</span></label>
          <input type="date" name="dataInicio" class="form-control" value="${item ? item.dataInicio : new Date().toISOString().split('T')[0]}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Status <span class="required">*</span></label>
          <select name="status" class="form-control" required>
            <option value="AGENDADA" ${item && item.status === 'AGENDADA' ? 'selected' : ''}>Agendada</option>
            <option value="EM_ANDAMENTO" ${!item || item.status === 'EM_ANDAMENTO' ? 'selected' : ''}>Em Andamento</option>
            <option value="CONCLUIDA" ${item && item.status === 'CONCLUIDA' ? 'selected' : ''}>Concluída</option>
            <option value="CANCELADA" ${item && item.status === 'CANCELADA' ? 'selected' : ''}>Cancelada</option>
          </select>
        </div>
      </div>
    `;

    const modal = new Modal({
      title: isEdit ? 'Editar reparo' : 'Registrar reparo',
      content: formContent,
      footerButtons: [
        {
          text: 'Cancelar',
          class: 'btn-secondary',
          onClick: (m) => m.close(),
        },
        {
          text: isEdit ? 'Salvar alterações' : 'Registrar reparo',
          class: 'btn-primary',
          onClick: (m) => {
            const formData = new FormData(formContent);
            const custoRaw = parseFloat(formData.get('custo') as string);
            const dto: CriarManutencaoDTO = {
              equipamentoId: (formData.get('equipamentoId') as string) || '',
              descricao: (formData.get('descricao') as string) || '',
              tecnicoResponsavelId: (formData.get('tecnicoResponsavelId') as string) || null,
              custo: isNaN(custoRaw) ? 0 : custoRaw,
              dataInicio: (formData.get('dataInicio') as string) || '',
              status: (formData.get('status') as StatusManutencao) || 'AGENDADA',
            };

            try {
              if (isEdit) {
                ManutencaoService.update(idEdicao!, dto);
                Toast.success('Reparo atualizado com sucesso!');
              } else {
                ManutencaoService.create(dto);
                Toast.success('Reparo registrado com sucesso!');
              }
              m.close();
            } catch (err: any) {
              Toast.error(err.message || 'Não foi possível salvar o reparo.');
            }
          },
        },
      ],
    });

    modal.open();
  }

  private concluirManutencao(id: string): void {
    try {
      ManutencaoService.concluir(id);
      Toast.success('Reparo concluído; equipamento disponível!');
    } catch (err: any) {
      Toast.error(err.message || 'Não foi possível concluir o reparo.');
    }
  }

  private openDetailsModal(id: string): void {
    const m = ManutencaoService.getById(id);
    if (!m) return;

    const eq = EquipamentoService.getById(m.equipamentoId);

    const detailsContent = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <span style="font-size: 0.8rem; font-family: monospace; color: var(--accent-primary); font-weight: 700;">${m.id}</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-top: 0.1rem;">${eq ? eq.modelo : 'Equipamento'}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${eq ? `Código: ${escapeHtml(eq.codigo)}` : ''}</span>
          </div>
          <div>${getStatusManutencaoBadge(m.status)}</div>
        </div>

        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">Descrição do Serviço:</strong>
          <p style="font-size: 0.95rem; line-height: 1.6; margin-top: 0.35rem; color: var(--text-main); background: var(--bg-card); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            ${m.descricao}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.9rem;">
          <div><strong>Técnico Responsável:</strong> ${FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado)}</div>
          <div><strong>Custo do Serviço:</strong> <span style="font-weight: 700; color: var(--color-warning);">${formatCurrency(m.custo)}</span></div>
          <div><strong>Data de Início:</strong> ${formatDate(m.dataInicio)}</div>
          <div><strong>Data de Conclusão:</strong> ${formatDate(m.dataConclusao)}</div>
        </div>
      </div>
    `;

    const modal = new Modal({
      title: 'Detalhes do reparo',
      content: detailsContent,
    });
    modal.open();
  }

  private confirmDelete(id: string): void {
    const m = ManutencaoService.getById(id);
    if (!m) return;

    ConfirmDialog.show({
      title: 'Excluir reparo',
      message: `Tem certeza que deseja excluir o reparo <strong>${m.id}</strong>? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: () => {
        try {
          ManutencaoService.delete(id);
          Toast.success('Reparo excluído com sucesso!');
        } catch (err: any) {
          Toast.error(err.message || 'Não foi possível excluir o reparo.');
        }
      },
    });
  }
}
