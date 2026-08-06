import { EquipamentoService } from '../services/equipamentoService';
import { UsuarioService } from '../services/usuarioService';
import { ManutencaoService } from '../services/manutencaoService';
import { FuncionarioService } from '../services/funcionarioService';
import { Equipamento, TipoEquipamento, StatusEquipamento, CriarEquipamentoDTO } from '../types/equipamento';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { getStatusEquipamentoBadge, getTipoEquipamentoLabel, formatDate, formatCurrency, getStatusManutencaoBadge } from '../utils/formatters';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { renderEmptyState } from '../components/emptyState';
import { Modal } from '../components/modal';
import { ConfirmDialog } from '../components/confirmDialog';
import { Toast } from '../components/toast';
import { bindDebouncedSearch, escapeHtml } from '../utils/inputBehavior';

export class EquipamentosPage {
  private container: HTMLElement;
  private searchKeyword: string = '';
  private filterTipo: string = '';
  private filterStatus: string = '';
  private currentPage: number = 1;
  private pageSize: number = 8;
  private sortField: keyof Equipamento = 'criadoEm';
  private sortAsc: boolean = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'equipamentos-page';
  }

  public render(): HTMLElement {
    let list = EquipamentoService.getAll();

    // Filters
    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      list = list.filter(
        (eq) => {
          const cliente = UsuarioService.getById(eq.clienteId);
          return eq.codigo.toLowerCase().includes(kw) ||
          eq.modelo.toLowerCase().includes(kw) ||
          eq.numeroSerie.toLowerCase().includes(kw) ||
          eq.fabricante.toLowerCase().includes(kw) ||
          eq.tipo.toLowerCase().includes(kw) ||
          (cliente?.nome.toLowerCase().includes(kw) ?? false);
        }
      );
    }

    if (this.filterTipo) {
      list = list.filter((eq) => eq.tipo === this.filterTipo);
    }

    if (this.filterStatus) {
      list = list.filter((eq) => eq.status === this.filterStatus);
    }

    // Sort
    list.sort((a, b) => {
      if (this.sortField === 'codigo') {
        const numberA = Number(a.codigo.match(/(\d+)$/)?.[1] ?? 0);
        const numberB = Number(b.codigo.match(/(\d+)$/)?.[1] ?? 0);
        return this.sortAsc ? numberA - numberB : numberB - numberA;
      }
      const valA = a[this.sortField] || '';
      const valB = b[this.sortField] || '';
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    const { paginatedItems, totalPages, startItem, endItem, totalItems } = calculatePagination(
      list,
      this.currentPage,
      this.pageSize
    );

    // Unique sectors for dropdown filter

    this.container.innerHTML = `
      <div class="table-container">
        <!-- Toolbar & Filters -->
        <div class="table-toolbar">
          <div class="table-toolbar-left">
            <input
              type="text"
              id="search-input"
              class="form-control table-search-input"
              placeholder="Pesquisar por código, cliente, modelo, série..."
              value="${escapeHtml(this.searchKeyword)}"
            />
            
            <select id="filter-tipo" class="form-control" style="width: auto;">
              <option value="">Todos os Tipos</option>
              <option value="NOTEBOOK" ${this.filterTipo === 'NOTEBOOK' ? 'selected' : ''}>Notebook</option>
              <option value="DESKTOP" ${this.filterTipo === 'DESKTOP' ? 'selected' : ''}>Desktop</option>
              <option value="MONITOR" ${this.filterTipo === 'MONITOR' ? 'selected' : ''}>Monitor</option>
              <option value="IMPRESSORA" ${this.filterTipo === 'IMPRESSORA' ? 'selected' : ''}>Impressora</option>
              <option value="CELULAR" ${this.filterTipo === 'CELULAR' ? 'selected' : ''}>Celular</option>
              <option value="OUTRO" ${this.filterTipo === 'OUTRO' ? 'selected' : ''}>Outro</option>
            </select>

            <select id="filter-status" class="form-control" style="width: auto;">
              <option value="">Todos os Status</option>
              <option value="DISPONIVEL" ${this.filterStatus === 'DISPONIVEL' ? 'selected' : ''}>Disponível</option>
              <option value="EM_USO" ${this.filterStatus === 'EM_USO' ? 'selected' : ''}>Em Uso</option>
              <option value="EM_MANUTENCAO" ${this.filterStatus === 'EM_MANUTENCAO' ? 'selected' : ''}>Em reparo</option>
              <option value="DESCARTADO" ${this.filterStatus === 'DESCARTADO' ? 'selected' : ''}>Descartado</option>
            </select>

            ${
              this.searchKeyword || this.filterTipo || this.filterStatus
                ? `<button id="clear-filters-btn" class="btn btn-secondary" style="padding: 0.5rem 0.75rem;">${iconHTML('x', '', 16)} Limpar Filtros</button>`
                : ''
            }
          </div>

          <div class="table-toolbar-right">
            <button id="add-equipamento-btn" class="btn btn-primary">
              ${iconHTML('plus', '', 18)} Novo Equipamento
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive">
          ${
            paginatedItems.length === 0
              ? renderEmptyState('Nenhum equipamento cadastrado', 'Cadastre o primeiro equipamento ou altere os filtros aplicados.', 'laptop')
              : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th class="sortable" data-sort="codigo">Código do equipamento ${this.getSortIcon('codigo')}</th>
                    <th class="sortable" data-sort="modelo">Equipamento ${this.getSortIcon('modelo')}</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th style="text-align: right;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedItems
                    .map((eq) => {
                      const userResp = UsuarioService.getById(eq.clienteId);
                      return `
                        <tr>
                          <td style="font-weight: 700; color: var(--accent-primary);">${escapeHtml(eq.codigo)}</td>
                          <td>
                            <div style="font-weight: 600;">${eq.modelo}</div>
                            <div style="font-size: 0.775rem; color: var(--text-muted);">${eq.fabricante} • SN: ${eq.numeroSerie}</div>
                          </td>
                          <td>${getTipoEquipamentoLabel(eq.tipo)}</td>
                          <td>${userResp ? `<span style="font-weight: 600;">${userResp.nome}</span>` : '<span style="color: var(--text-muted);">-</span>'}</td>
                          <td>${getStatusEquipamentoBadge(eq.status)}</td>
                          <td style="text-align: right;">
                            <div class="table-actions" style="justify-content: flex-end;">
                              <button class="btn-icon view-btn" data-id="${eq.id}" title="Detalhes">${iconHTML('eye', '', 18)}</button>
                              <button class="btn-icon edit-btn" data-id="${eq.id}" title="Editar">${iconHTML('edit-3', '', 18)}</button>
                              <button class="btn-icon delete-btn" data-id="${eq.id}" title="Excluir" style="color: var(--color-danger);">${iconHTML('trash-2', '', 18)}</button>
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

  private getSortIcon(field: keyof Equipamento): string {
    if (this.sortField !== field) return '';
    return this.sortAsc ? '▲' : '▼';
  }

  private attachEvents(): void {
    // Search
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

    // Filter select changes
    const selectTipo = this.container.querySelector('#filter-tipo') as HTMLSelectElement;
    if (selectTipo) {
      selectTipo.addEventListener('change', () => {
        this.filterTipo = selectTipo.value;
        this.currentPage = 1;
        this.render();
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

    // Clear filters
    const clearBtn = this.container.querySelector('#clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchKeyword = '';
        this.filterTipo = '';
        this.filterStatus = '';
        this.currentPage = 1;
        this.render();
      });
    }

    // Sort headers
    this.container.querySelectorAll('.sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort') as keyof Equipamento;
        if (this.sortField === field) {
          this.sortAsc = !this.sortAsc;
        } else {
          this.sortField = field;
          this.sortAsc = true;
        }
        this.render();
      });
    });

    // Pagination
    this.container.querySelectorAll('.pagination-btn[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-page') || '1', 10);
        if (!isNaN(page)) {
          this.currentPage = page;
          this.render();
        }
      });
    });

    // Add button
    const addBtn = this.container.querySelector('#add-equipamento-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openFormModal());
    }

    // Action buttons (View, Edit, Delete)
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
    const item = isEdit ? EquipamentoService.getById(idEdicao!) : null;
    const usuariosAtivos = UsuarioService.getAll().filter((u) => u.status === 'ATIVO');

    const formContent = document.createElement('form');
    formContent.className = 'equipamento-form';
    formContent.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Código do equipamento</label>
          ${isEdit
            ? `<input type="text" name="codigo" class="form-control" value="${escapeHtml(item?.codigo)}" readonly aria-readonly="true" />`
            : `<div class="form-control readonly-hint" role="note">${iconHTML('sparkles', '', 16)} O código será gerado automaticamente após o cadastro</div>`}
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de Equipamento <span class="required">*</span></label>
          <select name="tipo" class="form-control" required>
            <option value="">Selecione...</option>
            <option value="NOTEBOOK" ${item && item.tipo === 'NOTEBOOK' ? 'selected' : ''}>Notebook</option>
            <option value="DESKTOP" ${item && item.tipo === 'DESKTOP' ? 'selected' : ''}>Desktop</option>
            <option value="MONITOR" ${item && item.tipo === 'MONITOR' ? 'selected' : ''}>Monitor</option>
            <option value="IMPRESSORA" ${item && item.tipo === 'IMPRESSORA' ? 'selected' : ''}>Impressora</option>
            <option value="CELULAR" ${item && item.tipo === 'CELULAR' ? 'selected' : ''}>Celular</option>
            <option value="OUTRO" ${item && item.tipo === 'OUTRO' ? 'selected' : ''}>Outro</option>
          </select>
          <div class="field-error" id="err-tipo"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Fabricante <span class="required">*</span></label>
          <input type="text" name="fabricante" class="form-control" placeholder="ex: Dell, HP, Lenovo" value="${escapeHtml(item?.fabricante)}" required />
          <div class="field-error" id="err-fabricante"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Modelo <span class="required">*</span></label>
          <input type="text" name="modelo" class="form-control" placeholder="ex: Latitude 5430 i7" value="${escapeHtml(item?.modelo)}" required />
          <div class="field-error" id="err-modelo"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Número de Série <span style="color: var(--text-muted); font-weight: 500;">(opcional)</span></label>
          <input type="text" name="numeroSerie" class="form-control" placeholder="ex: SN-DELL-991 ou deixe em branco" value="${escapeHtml(item?.numeroSerie)}" />
          <div class="field-error" id="err-numeroSerie"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Status <span class="required">*</span></label>
          <select name="status" id="form-status-select" class="form-control" required>
            <option value="DISPONIVEL" ${item && item.status === 'DISPONIVEL' ? 'selected' : ''}>Disponível</option>
            <option value="EM_USO" ${item && item.status === 'EM_USO' ? 'selected' : ''}>Em Uso</option>
            <option value="EM_MANUTENCAO" ${item && item.status === 'EM_MANUTENCAO' ? 'selected' : ''}>Em reparo</option>
            <option value="DESCARTADO" ${item && item.status === 'DESCARTADO' ? 'selected' : ''}>Descartado</option>
          </select>
          <div class="field-error" id="err-status"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Cliente <span class="required">*</span></label>
          <select name="clienteId" class="form-control" required>
            <option value="">Selecione...</option>
            ${usuariosAtivos
              .map(
                (u) =>
                  `<option value="${escapeHtml(u.id)}" ${item && item.clienteId === u.id ? 'selected' : ''}>${escapeHtml(u.nome)}</option>`
              )
              .join('')}
          </select>
          <div class="field-error" id="err-clienteId"></div>
        </div>

        <div class="form-group form-grid-full">
          <label class="form-label">Data de Aquisição <span class="required">*</span></label>
          <input type="date" name="dataAquisicao" class="form-control" value="${item ? item.dataAquisicao : new Date().toISOString().split('T')[0]}" required />
          <div class="field-error" id="err-dataAquisicao"></div>
        </div>

        <div class="form-group form-grid-full">
          <label class="form-label">Observações</label>
          <textarea name="observacoes" class="form-control" placeholder="Detalhes de garantia, especificações ou avarias...">${escapeHtml(item?.observacoes)}</textarea>
        </div>
      </div>
    `;

    const modal = new Modal({
      title: isEdit ? 'Editar Equipamento' : 'Cadastrar Equipamento',
      content: formContent,
      footerButtons: [
        {
          text: 'Cancelar',
          class: 'btn-secondary',
          onClick: (m) => m.close(),
        },
        {
          text: isEdit ? 'Salvar Alterações' : 'Cadastrar Equipamento',
          class: 'btn-primary',
          onClick: (m) => {
            // Clear errors
            formContent.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
            formContent.querySelectorAll('.form-control').forEach((el) => el.classList.remove('is-invalid'));

            const formData = new FormData(formContent);
            const dto: CriarEquipamentoDTO = {
              tipo: (formData.get('tipo') as TipoEquipamento) || 'NOTEBOOK',
              fabricante: (formData.get('fabricante') as string) || '',
              modelo: (formData.get('modelo') as string) || '',
              numeroSerie: (formData.get('numeroSerie') as string) || '',
              status: (formData.get('status') as StatusEquipamento) || 'DISPONIVEL',
              clienteId: (formData.get('clienteId') as string) || '',
              dataAquisicao: (formData.get('dataAquisicao') as string) || '',
              observacoes: (formData.get('observacoes') as string) || '',
            };

            try {
              if (isEdit) {
                EquipamentoService.update(idEdicao!, dto);
                Toast.success('Equipamento atualizado com sucesso!');
              } else {
                EquipamentoService.create(dto);
                Toast.success('Equipamento cadastrado com sucesso!');
              }
              m.close();
            } catch (err: any) {
              const msg = err.message || 'Erro ao salvar equipamento.';
              Toast.error(msg);
            }
          },
        },
      ],
    });

    modal.open();
  }

  private openDetailsModal(id: string): void {
    const eq = EquipamentoService.getById(id);
    if (!eq) return;

    const user = UsuarioService.getById(eq.clienteId);
    const manutencoes = ManutencaoService.getByEquipamento(id);

    const detailsContent = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">${getTipoEquipamentoLabel(eq.tipo)}</span>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-top: 0.1rem;">${eq.modelo}</h3>
            <span style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 700;">${escapeHtml(eq.codigo)}</span>
          </div>
          <div>${getStatusEquipamentoBadge(eq.status)}</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.9rem;">
          <div><strong>Fabricante:</strong> ${eq.fabricante}</div>
          <div><strong>Nº de Série:</strong> ${eq.numeroSerie}</div>
          <div><strong>Data de Aquisição:</strong> ${formatDate(eq.dataAquisicao)}</div>
          <div style="grid-column: span 2;"><strong>Cadastrado em:</strong> ${formatDate(eq.criadoEm)}</div>
        </div>

        ${
          user
            ? `
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 1rem; border-radius: var(--radius-md);">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">
                ${iconHTML('user', '', 14)} Cliente responsável
              </div>
              <div style="font-weight: 700; font-size: 1rem;">${user.nome}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${user.cargo} • ${user.email}</div>
            </div>
          `
            : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Nenhum cliente vinculado atualmente.</div>'
        }

        ${
          eq.observacoes
            ? `
            <div>
              <strong>Observações:</strong>
              <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">${eq.observacoes}</p>
            </div>
          `
            : ''
        }

        <!-- Maintenance History -->
        <div style="margin-top: 0.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            ${iconHTML('wrench', '', 16)} Histórico de reparos (${manutencoes.length})
          </h4>
          ${
            manutencoes.length === 0
              ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Nenhum reparo registrado para este equipamento.</p>'
              : `
              <div class="table-responsive" style="max-height: 200px;">
                <table class="data-table" style="font-size: 0.8rem;">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Técnico</th>
                      <th>Custo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${manutencoes
                      .map(
                        (m) => `
                      <tr>
                        <td>${m.descricao}</td>
                        <td>${FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado)}</td>
                        <td>${formatCurrency(m.custo)}</td>
                        <td>${getStatusManutencaoBadge(m.status)}</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `
          }
        </div>
      </div>
    `;

    const modal = new Modal({
      title: 'Detalhes do Equipamento',
      content: detailsContent,
    });
    modal.open();
  }

  private confirmDelete(id: string): void {
    const eq = EquipamentoService.getById(id);
    if (!eq) return;

    ConfirmDialog.show({
      title: 'Excluir Equipamento',
      message: `Tem certeza que deseja excluir o equipamento <strong>${escapeHtml(eq.modelo)} (${escapeHtml(eq.codigo)})</strong>? Esta ação não poderá ser desfeita.`,
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: () => {
        try {
          EquipamentoService.delete(id);
          Toast.success('Equipamento excluído com sucesso!');
        } catch (err: any) {
          Toast.error(err.message || 'Erro ao excluir equipamento.');
        }
      },
    });
  }
}
