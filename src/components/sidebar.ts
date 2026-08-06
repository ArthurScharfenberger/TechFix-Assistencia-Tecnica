import { getCurrentRoute, Route } from '../utils/navigation';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { clearTechFixData, getStorageItem, setStorageItem, KEYS, AppConfiguration } from '../services/storage';
import { ConfirmDialog } from './confirmDialog';
import { Toast } from './toast';
import techFixLogoUrl from '../img/techfix-logo-transparent.png';
import { exportLogs } from '../services/logger';

export class SidebarComponent {
  private element: HTMLElement;
  private collapsed: boolean;
  private onCollapseChange?: (collapsed: boolean) => void;
  private tooltip: HTMLElement;

  constructor(onCollapseChange?: (collapsed: boolean) => void) {
    this.element = document.createElement('aside');
    this.element.id = 'app-sidebar';
    this.onCollapseChange = onCollapseChange;
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'sidebar-tooltip';
    this.tooltip.hidden = true;
    document.body.appendChild(this.tooltip);
    const config = getStorageItem<AppConfiguration>(KEYS.CONFIGURACOES, {});
    this.collapsed = config.sidebarCollapsed === true;
    document.addEventListener('pointerdown', (event) => {
      if (!this.element.contains(event.target as Node)) this.closeOptions();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !(this.element.querySelector('#sidebar-options') as HTMLElement | null)?.hidden) { event.preventDefault(); this.closeOptions(true); }
    });
    const showTooltip = (target: EventTarget | null): void => {
      const item = (target as Element | null)?.closest<HTMLElement>('[data-tooltip]');
      if (!item || !this.collapsed || window.matchMedia('(max-width: 1024px)').matches) return;
      const bounds = item.getBoundingClientRect(); this.tooltip.textContent = item.dataset.tooltip ?? '';
      this.tooltip.style.left = `${bounds.right + 10}px`; this.tooltip.style.top = `${bounds.top + bounds.height / 2}px`; this.tooltip.hidden = false;
    };
    this.element.addEventListener('mouseover', (event) => showTooltip(event.target));
    this.element.addEventListener('focusin', (event) => showTooltip(event.target));
    this.element.addEventListener('mouseout', () => { this.tooltip.hidden = true; });
    this.element.addEventListener('focusout', () => { this.tooltip.hidden = true; });
  }

  public isCollapsed(): boolean { return this.collapsed; }

  public render(): HTMLElement {
    const currentRoute = getCurrentRoute();
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const links: Array<[Route, string, string]> = [
      ['dashboard', 'layout-dashboard', 'Dashboard'], ['equipamentos', 'laptop', 'Equipamentos'],
      ['usuarios', 'users', 'Clientes'], ['chamados', 'clipboard-list', 'Ordens de Serviço'],
      ['manutencoes', 'wrench', 'Reparos'], ['indicativos', 'bar-chart-3', 'Indicativos'], ['equipe', 'user-cog', 'Equipe'],
    ];
    this.element.className = `sidebar${this.collapsed ? ' collapsed' : ''}`;
    this.element.setAttribute('aria-label', 'Navegação principal');
    this.element.innerHTML = `
      <div class="sidebar-header">
        <a href="#/dashboard" class="sidebar-logo" aria-label="TechFix — ir para a visão geral">
          <img src="${techFixLogoUrl}" alt="TechFix — Assistência Técnica" />
          <span class="sidebar-compact-logo" aria-hidden="true">${iconHTML('monitor-cog', '', 25)}</span>
        </a>
      </div>
      <button id="sidebar-collapse-btn" class="sidebar-collapse-btn" type="button" aria-label="${this.collapsed ? 'Expandir' : 'Recolher'} barra lateral" title="${this.collapsed ? 'Expandir' : 'Recolher'} barra lateral">
        ${iconHTML(this.collapsed ? 'chevron-right' : 'chevron-left', '', 18)}
      </button>
      <nav class="sidebar-nav" aria-label="Páginas do TechFix">
        ${links.map(([route, icon, label]) => `<a href="#/${route}" class="nav-item ${currentRoute === route ? 'active' : ''}" data-route="${route}" aria-label="${label}" data-tooltip="${label}">${iconHTML(icon, '', 20)}<span class="sidebar-item-label">${label}</span></a>`).join('')}
      </nav>
      <div class="sidebar-footer">
        <div id="sidebar-options" class="sidebar-options" hidden>
          <div class="sidebar-options-heading">${iconHTML('graduation-cap', '', 15)} <span>Projeto acadêmico</span></div>
          <button id="theme-toggle-btn" class="sidebar-option" type="button">${iconHTML(isLight ? 'moon' : 'sun', '', 18)}<span>Tema ${isLight ? 'escuro' : 'claro'}</span></button>
          <button id="export-logs-btn" class="sidebar-option" type="button">${iconHTML('file-down', '', 18)}<span>Exportar logs</span></button>
          <div class="sidebar-options-separator"></div>
          <button id="clear-data-btn" class="sidebar-option danger" type="button">${iconHTML('trash-2', '', 18)}<span>Limpar dados</span></button>
        </div>
        <button id="sidebar-options-btn" class="sidebar-options-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="sidebar-options" aria-label="Mais opções" data-tooltip="Mais opções">
          ${iconHTML('settings', '', 19)}<span class="sidebar-item-label">Mais opções</span>${iconHTML('chevron-up', 'options-chevron', 16)}
        </button>
      </div>`;
    initIcons(this.element); this.attachEvents(); return this.element;
  }

  public updateActiveItem(route: Route): void {
    this.element.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.getAttribute('data-route') === route));
  }

  private closeOptions(restoreFocus = false): void {
    const menu = this.element.querySelector('#sidebar-options') as HTMLElement | null;
    const trigger = this.element.querySelector('#sidebar-options-btn') as HTMLButtonElement | null;
    if (!menu || menu.hidden) return;
    menu.hidden = true; trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus();
  }

  private attachEvents(): void {
    this.element.querySelector('#sidebar-collapse-btn')?.addEventListener('click', () => {
      this.collapsed = !this.collapsed;
      this.tooltip.hidden = true;
      const configs = getStorageItem<AppConfiguration>(KEYS.CONFIGURACOES, {});
      setStorageItem(KEYS.CONFIGURACOES, { ...configs, sidebarCollapsed: this.collapsed });
      this.render(); this.onCollapseChange?.(this.collapsed);
    });
    const optionsButton = this.element.querySelector('#sidebar-options-btn') as HTMLButtonElement;
    const options = this.element.querySelector('#sidebar-options') as HTMLElement;
    optionsButton.addEventListener('click', () => { this.tooltip.hidden = true; options.hidden = !options.hidden; optionsButton.setAttribute('aria-expanded', String(!options.hidden)); if (!options.hidden) (options.querySelector('button') as HTMLButtonElement | null)?.focus(); });
    options.addEventListener('keydown', (event) => {
      const buttons = [...options.querySelectorAll<HTMLButtonElement>('button')]; const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'ArrowDown') { event.preventDefault(); buttons[(index + 1) % buttons.length]?.focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); buttons[(index - 1 + buttons.length) % buttons.length]?.focus(); }
    });
    this.element.querySelector('#export-logs-btn')?.addEventListener('click', () => { this.closeOptions(); const count = exportLogs(); count ? Toast.success(`${count} registro(s) exportado(s) com sucesso!`) : Toast.info('Não existem logs para exportar.'); });
    this.element.querySelector('#theme-toggle-btn')?.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      const configs = getStorageItem<AppConfiguration>(KEYS.CONFIGURACOES, {});
      setStorageItem(KEYS.CONFIGURACOES, { ...configs, theme: newTheme });
      this.closeOptions(); Toast.info(`Modo ${newTheme === 'light' ? 'claro' : 'escuro'} ativado.`); this.render();
    });
    this.element.querySelector('#clear-data-btn')?.addEventListener('click', () => { this.closeOptions(); ConfirmDialog.show({ title: 'Limpar todos os dados?', message: 'Esta ação removerá clientes, equipamentos, ordens de serviço, reparos, equipe, logs e demais dados cadastrados neste navegador. Esta ação não poderá ser desfeita.', confirmText: 'Limpar dados', confirmVariant: 'danger', onConfirm: () => { try { clearTechFixData(); window.location.hash = '#/dashboard'; Toast.success('Dados removidos com sucesso.'); } catch { Toast.error('Não foi possível remover os dados.'); } } }); });
  }
}
