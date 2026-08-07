import { getCurrentRoute, Route } from '../utils/navigation';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { clearTechFixData, getStorageItem, setStorageItem, KEYS, AppConfiguration } from '../services/storage';
import { ConfirmDialog } from './confirmDialog';
import { Toast } from './toast';
import techFixLogoUrl from '../img/techfix-logo-transparent.png';
import { exportLogs } from '../services/logger';
import { AuthService } from '../services/authService';

export class SidebarComponent {
  private element: HTMLElement;
  private collapsed: boolean;
  private onCollapseChange?: (collapsed: boolean) => void;
  private tooltip: HTMLElement;
  private reportsOpen = false;

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
      if (!this.element.contains(event.target as Node)) {
        this.closeOptions();
        if (this.collapsed && this.reportsOpen) { this.reportsOpen = false; this.updateReportsMenu(); }
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !(this.element.querySelector('#sidebar-options') as HTMLElement | null)?.hidden) { event.preventDefault(); this.closeOptions(true); }
      if (event.key === 'Escape' && this.collapsed && this.reportsOpen) { event.preventDefault(); this.reportsOpen = false; this.updateReportsMenu(); (this.element.querySelector('#reports-menu-trigger') as HTMLElement | null)?.focus(); }
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
    const reportRouteActive = currentRoute === 'relatorios' || currentRoute.startsWith('relatorios/');
    if (reportRouteActive) this.reportsOpen = true;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const currentUser = AuthService.getCurrentUser();
    const initials = currentUser?.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? 'TF';
    const cargoLabel = currentUser ? currentUser.cargo.charAt(0) + currentUser.cargo.slice(1).toLowerCase() : '';
    const links: Array<[Route, string, string]> = [
      ['dashboard', 'layout-dashboard', 'Dashboard'], ['equipamentos', 'laptop', 'Equipamentos'],
      ['usuarios', 'users', 'Clientes'], ['chamados', 'clipboard-list', 'Ordens de Serviço'],
      ['manutencoes', 'wrench', 'Reparos'], ['indicativos', 'bar-chart-3', 'Indicativos'],
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
        <div class="sidebar-report-group ${this.reportsOpen ? 'open' : ''} ${reportRouteActive ? 'active' : ''}">
          <button id="reports-menu-trigger" class="nav-item reports-menu-trigger" type="button" aria-expanded="${this.reportsOpen}" aria-controls="sidebar-reports-submenu" aria-label="Relatórios" data-tooltip="Relatórios">${iconHTML('file-bar-chart', '', 20)}<span class="sidebar-item-label">Relatórios</span>${iconHTML(this.reportsOpen ? 'chevron-down' : 'chevron-right', 'reports-chevron', 16)}</button>
          <div id="sidebar-reports-submenu" class="reports-submenu" ${this.reportsOpen ? '' : 'hidden'}>
            <strong class="reports-popover-title">Relatórios</strong>
            ${([['relatorios','Visão geral'],['relatorios/ordens','Ordens de Serviço'],['relatorios/reparos','Reparos e Custos'],['relatorios/equipe','Equipe'],['relatorios/clientes-equipamentos','Clientes e Equipamentos']] as Array<[Route,string]>).map(([route,label])=>`<a href="#/${route}" class="nav-item report-subitem ${currentRoute===route?'active':''}" data-route="${route}" ${currentRoute===route?'aria-current="page"':''}>${label}</a>`).join('')}
          </div>
        </div>
        <a href="#/equipe" class="nav-item ${currentRoute === 'equipe' ? 'active' : ''}" data-route="equipe" aria-label="Equipe" data-tooltip="Equipe">${iconHTML('user-cog', '', 20)}<span class="sidebar-item-label">Equipe</span></a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" data-tooltip="${currentUser?.nome ?? 'Usuário'}">
          <span class="sidebar-user-avatar" aria-hidden="true">${initials}</span>
          <span class="sidebar-user-info"><strong>${currentUser?.nome ?? 'Usuário'}</strong><small>${cargoLabel}</small></span>
        </div>
        <div id="sidebar-options" class="sidebar-options" hidden>
          <div class="sidebar-options-heading">${iconHTML('graduation-cap', '', 15)} <span>Projeto acadêmico</span></div>
          <button id="theme-toggle-btn" class="sidebar-option" type="button">${iconHTML(isLight ? 'moon' : 'sun', '', 18)}<span>Tema ${isLight ? 'escuro' : 'claro'}</span></button>
          <button id="export-logs-btn" class="sidebar-option" type="button">${iconHTML('file-down', '', 18)}<span>Exportar logs</span></button>
          <button id="logout-btn" class="sidebar-option" type="button">${iconHTML('log-out', '', 18)}<span>Sair</span></button>
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
    const reportActive = route === 'relatorios' || route.startsWith('relatorios/');
    this.element.querySelector('.sidebar-report-group')?.classList.toggle('active', reportActive);
    if (reportActive && !this.reportsOpen) { this.reportsOpen = true; this.updateReportsMenu(); }
    if (!reportActive && this.reportsOpen) { this.reportsOpen = false; this.updateReportsMenu(); }
  }

  private closeOptions(restoreFocus = false): void {
    const menu = this.element.querySelector('#sidebar-options') as HTMLElement | null;
    const trigger = this.element.querySelector('#sidebar-options-btn') as HTMLButtonElement | null;
    if (!menu || menu.hidden) return;
    menu.hidden = true; trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger?.focus();
  }

  private attachEvents(): void {
    this.element.querySelector('#reports-menu-trigger')?.addEventListener('click', () => { this.tooltip.hidden = true; this.reportsOpen = !this.reportsOpen; this.updateReportsMenu(); });
    this.element.querySelector('#sidebar-reports-submenu')?.addEventListener('keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      const links=[...this.element.querySelectorAll<HTMLElement>('.report-subitem')],index=links.indexOf(document.activeElement as HTMLElement);
      if(keyboardEvent.key==='ArrowDown'){event.preventDefault();links[(index+1)%links.length]?.focus();}
      if(keyboardEvent.key==='ArrowUp'){event.preventDefault();links[(index-1+links.length)%links.length]?.focus();}
      if(keyboardEvent.key==='Escape'){event.preventDefault();this.reportsOpen=false;this.updateReportsMenu();(this.element.querySelector('#reports-menu-trigger') as HTMLElement|null)?.focus();}
    });
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
    this.element.querySelector('#logout-btn')?.addEventListener('click', () => {
      this.closeOptions();
      AuthService.logout();
      history.replaceState(null, '', '#/login');
      window.location.reload();
    });
    this.element.querySelector('#clear-data-btn')?.addEventListener('click', () => { this.closeOptions(); ConfirmDialog.show({ title: 'Limpar todos os dados?', message: 'Esta ação removerá clientes, equipamentos, ordens de serviço, reparos, equipe, logs e demais dados cadastrados neste navegador. Esta ação não poderá ser desfeita.', confirmText: 'Limpar dados', confirmVariant: 'danger', onConfirm: () => { try { clearTechFixData(); window.location.hash = '#/dashboard'; Toast.success('Dados removidos com sucesso.'); } catch { Toast.error('Não foi possível remover os dados.'); } } }); });
  }

  private updateReportsMenu(): void {
    const group=this.element.querySelector('.sidebar-report-group'),trigger=this.element.querySelector<HTMLElement>('#reports-menu-trigger'),menu=this.element.querySelector<HTMLElement>('#sidebar-reports-submenu');
    group?.classList.toggle('open',this.reportsOpen);trigger?.setAttribute('aria-expanded',String(this.reportsOpen));if(menu)menu.hidden=!this.reportsOpen;
    const chevron=trigger?.querySelector('.reports-chevron');if(chevron){chevron.outerHTML=iconHTML(this.reportsOpen?'chevron-down':'chevron-right','reports-chevron',16);initIcons(trigger as HTMLElement);}
    if(this.reportsOpen&&this.collapsed&&menu&&trigger){const bounds=trigger.getBoundingClientRect();menu.style.left=`${bounds.right+10}px`;menu.style.top=`${Math.max(8,Math.min(bounds.top,window.innerHeight-menu.offsetHeight-8))}px`;(menu.querySelector('a') as HTMLElement|null)?.focus();}else if(menu){menu.style.removeProperty('left');menu.style.removeProperty('top');}
  }
}
