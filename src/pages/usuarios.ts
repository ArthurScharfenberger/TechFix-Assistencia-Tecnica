import { UsuarioService } from '../services/usuarioService';
import { StatusUsuario, CriarUsuarioDTO } from '../types/usuario';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { getStatusUsuarioBadge, formatDate } from '../utils/formatters';
import { calculatePagination, renderPaginationControls } from '../components/pagination';
import { renderEmptyState } from '../components/emptyState';
import { Modal } from '../components/modal';
import { ConfirmDialog } from '../components/confirmDialog';
import { Toast } from '../components/toast';
import { bindDebouncedSearch, escapeHtml } from '../utils/inputBehavior';

export class UsuariosPage {
  private container: HTMLElement;
  private searchKeyword: string = '';
  private filterStatus: string = '';
  private currentPage: number = 1;
  private pageSize: number = 8;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'usuarios-page';
  }

  public render(): HTMLElement {
    let list = UsuarioService.getAll();

    // Filters
    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      list = list.filter(
        (u) => u.nome.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)
      );
    }

    if (this.filterStatus) {
      list = list.filter((u) => u.status === this.filterStatus);
    }

    const { paginatedItems, totalPages, startItem, endItem, totalItems } = calculatePagination(
      list,
      this.currentPage,
      this.pageSize
    );

    this.container.innerHTML = `
      <div class="table-container">
        <!-- Toolbar -->
        <div class="table-toolbar">
          <div class="table-toolbar-left">
            <input
              type="text"
              id="search-input"
              class="form-control table-search-input"
              placeholder="Pesquisar por nome ou e-mail..."
              value="${escapeHtml(this.searchKeyword)}"
            />

            <select id="filter-status" class="form-control" style="width: auto;">
              <option value="">Todos os Status</option>
              <option value="ATIVO" ${this.filterStatus === 'ATIVO' ? 'selected' : ''}>Ativo</option>
              <option value="INATIVO" ${this.filterStatus === 'INATIVO' ? 'selected' : ''}>Inativo</option>
            </select>

            ${
              this.searchKeyword || this.filterStatus
                ? `<button id="clear-filters-btn" class="btn btn-secondary" style="padding: 0.5rem 0.75rem;">${iconHTML('x', '', 16)} Limpar Filtros</button>`
                : ''
            }
          </div>

          <div class="table-toolbar-right">
            <button id="add-usuario-btn" class="btn btn-primary">
              ${iconHTML('user-plus', '', 18)} Novo cliente
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive">
          ${
            paginatedItems.length === 0
              ? renderEmptyState('Nenhum cliente encontrado', 'Tente ajustar a busca ou cadastrar um novo cliente.', 'users')
              : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th style="text-align: right;">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  ${paginatedItems
                    .map((u) => {
                      const associadosCount = UsuarioService.getEquipamentosAssociados(u.id).length;
                      return `
                        <tr>
                          <td>
                            <div style="font-weight: 700;">${u.nome}</div>
                            ${
                              associadosCount > 0
                                ? `<span class="badge badge-info" style="font-size: 0.7rem; margin-top: 0.2rem;">${associadosCount} Equip.</span>`
                                : ''
                            }
                          </td>
                          <td style="color: var(--accent-primary);">${u.email}</td>
                          <td>${u.cargo}</td>
                          <td>${getStatusUsuarioBadge(u.status)}</td>
                          <td style="text-align: right;">
                            <div class="table-actions" style="justify-content: flex-end;">
                              <button class="btn-icon view-btn" data-id="${u.id}" title="Detalhes">${iconHTML('eye', '', 18)}</button>
                              <button class="btn-icon edit-btn" data-id="${u.id}" title="Editar">${iconHTML('edit-3', '', 18)}</button>
                              <button class="btn-icon delete-btn" data-id="${u.id}" title="Excluir" style="color: var(--color-danger);">${iconHTML('trash-2', '', 18)}</button>
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

    const clearBtn = this.container.querySelector('#clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchKeyword = '';
        this.filterStatus = '';
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

    const addBtn = this.container.querySelector('#add-usuario-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openFormModal());
    }

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
    const item = isEdit ? UsuarioService.getById(idEdicao!) : null;

    const formContent = document.createElement('form');
    formContent.className = 'usuario-form';
    formContent.innerHTML = `
      <div class="form-grid">
        <div class="form-group form-grid-full">
          <label class="form-label">Nome Completo <span class="required">*</span></label>
          <input type="text" name="nome" class="form-control" placeholder="Nome do cliente" value="${escapeHtml(item?.nome)}" required />
        </div>

        <div class="form-group form-grid-full">
          <label class="form-label">E-mail <span class="required">*</span></label>
          <input type="email" name="email" class="form-control" placeholder="ex: cliente@email.com" value="${escapeHtml(item?.email)}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Cargo <span class="required">*</span></label>
          <input type="text" name="cargo" class="form-control" placeholder="ex: Analista de Suporte" value="${escapeHtml(item?.cargo)}" required />
        </div>

        <div class="form-group form-grid-full">
          <label class="form-label">Status <span class="required">*</span></label>
          <select name="status" class="form-control" required>
            <option value="ATIVO" ${item && item.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
            <option value="INATIVO" ${item && item.status === 'INATIVO' ? 'selected' : ''}>Inativo</option>
          </select>
        </div>
      </div>
    `;

    const modal = new Modal({
      title: isEdit ? 'Editar cliente' : 'Cadastrar cliente',
      content: formContent,
      footerButtons: [
        {
          text: 'Cancelar',
          class: 'btn-secondary',
          onClick: (m) => m.close(),
        },
        {
          text: isEdit ? 'Salvar alterações' : 'Cadastrar cliente',
          class: 'btn-primary',
          onClick: (m) => {
            const formData = new FormData(formContent);
            const dto: CriarUsuarioDTO = {
              nome: (formData.get('nome') as string) || '',
              email: (formData.get('email') as string) || '',
              cargo: (formData.get('cargo') as string) || '',
              status: (formData.get('status') as StatusUsuario) || 'ATIVO',
            };

            try {
              if (isEdit) {
                UsuarioService.update(idEdicao!, dto);
                Toast.success('Cliente atualizado com sucesso!');
              } else {
                UsuarioService.create(dto);
                Toast.success('Cliente cadastrado com sucesso!');
              }
              m.close();
            } catch (err: any) {
              Toast.error(err.message || 'Não foi possível salvar o cliente.');
            }
          },
        },
      ],
    });

    modal.open();
  }

  private openDetailsModal(id: string): void {
    const usuario = UsuarioService.getById(id);
    if (!usuario) return;

    const equipamentos = UsuarioService.getEquipamentosAssociados(id);

    const contentHtml = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">${usuario.nome}</h3>
            <span style="font-size: 0.9rem; color: var(--accent-primary); font-weight: 600;">${usuario.email}</span>
          </div>
          <div>${getStatusUsuarioBadge(usuario.status)}</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.9rem;">
          <div><strong>Cargo:</strong> ${usuario.cargo}</div>
          <div><strong>Cadastrado em:</strong> ${formatDate(usuario.criadoEm)}</div>
          <div><strong>Última atualização:</strong> ${formatDate(usuario.atualizadoEm)}</div>
        </div>

        <!-- Associated Equipment -->
        <div style="margin-top: 0.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            ${iconHTML('laptop', '', 16)} Equipamentos Atribuidos (${equipamentos.length})
          </h4>
          ${
            equipamentos.length === 0
              ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Nenhum equipamento associado a este cliente.</p>'
              : `
              <div class="table-responsive" style="max-height: 200px;">
                <table class="data-table" style="font-size: 0.8rem;">
                  <thead>
                    <tr>
                      <th>Código do equipamento</th>
                      <th>Modelo</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${equipamentos
                      .map(
                        (eq) => `
                      <tr>
                        <td style="font-weight: 700; color: var(--accent-primary);">${escapeHtml(eq.codigo)}</td>
                        <td>${eq.modelo}</td>
                        <td>${eq.tipo}</td>
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
      title: 'Detalhes do cliente',
      content: contentHtml,
    });
    modal.open();
  }

  private confirmDelete(id: string): void {
    const usuario = UsuarioService.getById(id);
    if (!usuario) return;

    const associados = UsuarioService.getEquipamentosAssociados(id);

    if (associados.length > 0) {
      const listaEquipHtml = associados
        .map((eq) => `<li style="margin-left: 1.25rem;"><strong>${escapeHtml(eq.modelo)}</strong> (Código: ${escapeHtml(eq.codigo)})</li>`)
        .join('');

      ConfirmDialog.show({
        title: 'Cliente com equipamentos associados',
        message: `
          <p>O cliente <strong>${usuario.nome}</strong> possui <strong>${associados.length} equipamento(s)</strong> associado(s):</p>
          <ul style="margin: 0.5rem 0 1rem 0; font-size: 0.875rem; color: var(--color-warning);">
            ${listaEquipHtml}
          </ul>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Desassocie ou reatribua esses equipamentos antes de excluir o cliente.</p>
        `,
        confirmText: 'Entendido',
        confirmVariant: 'secondary',
        onConfirm: () => {},
      });
      return;
    }

    ConfirmDialog.show({
      title: 'Excluir cliente',
      message: `Tem certeza de que deseja excluir o cliente <strong>${usuario.nome}</strong> (${usuario.email})? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: () => {
        try {
          UsuarioService.delete(id);
          Toast.success('Cliente excluído com sucesso!');
        } catch (err: any) {
          Toast.error(err.message || 'Não foi possível excluir o cliente.');
        }
      },
    });
  }
}
