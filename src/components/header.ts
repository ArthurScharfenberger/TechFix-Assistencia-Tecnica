import { getCurrentRoute, Route } from '../utils/navigation';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { AuthService } from '../services/authService';
import { getStorageItem, setStorageItem, KEYS, AppConfiguration } from '../services/storage';
import { Toast } from './toast';

export class HeaderComponent {
  private element: HTMLElement;
  private onMobileMenuClick?: () => void;

  constructor(onMobileMenuClick?: () => void) {
    this.element = document.createElement('header');
    this.element.className = 'header';
    this.onMobileMenuClick = onMobileMenuClick;
  }

  public render(): HTMLElement {
    const currentRoute = getCurrentRoute();
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const currentUser = AuthService.getCurrentUser();
    const initials = currentUser?.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? 'TF';

    const navLinks: Array<[Route, string, string]> = [
      ['dashboard', 'layout-dashboard', 'Dashboard'],
      ['chamados', 'clipboard-list', 'Ordens'],
      ['manutencoes', 'wrench', 'Reparos'],
      ['usuarios', 'users', 'Clientes'],
      ['equipamentos', 'laptop', 'Equipamentos'],
      ['equipe', 'user-cog', 'Equipe'],
      ['indicativos', 'bar-chart-3', 'Indicativos'],
      ['relatorios', 'file-bar-chart', 'Relatórios'],
    ];

    this.element.innerHTML = `
      <div class="header-inner">
        <div class="header-brand-group">
          <button id="mobile-menu-toggle" class="mobile-menu-btn" aria-label="Abrir menu" aria-controls="app-sidebar" aria-expanded="false">
            ${iconHTML('menu', '', 20)}
          </button>
          <a href="#/dashboard" class="header-logo-link" aria-label="TechFix Atelier">
            <span class="header-logo-icon">${iconHTML('cpu', '', 18)}</span>
            <span class="header-logo-text">TechFix<span class="header-logo-dot"></span></span>
          </a>
          <span class="header-workspace-tag">ATELIER</span>
        </div>

        <nav class="header-nav-island" aria-label="Navegação do Console">
          ${navLinks
            .map(
              ([route, icon, label]) => `
            <a href="#/${route}" class="nav-pill ${currentRoute === route || (route === 'relatorios' && currentRoute.startsWith('relatorios')) ? 'active' : ''}" data-route="${route}">
              ${iconHTML(icon, '', 15)}
              <span>${label}</span>
            </a>
          `
            )
            .join('')}
        </nav>

        <div class="header-actions-group">
          <button id="header-theme-toggle" class="header-tool-btn" type="button" aria-label="Alternar tema" title="Alternar tema">
            ${iconHTML(isLight ? 'moon' : 'sun', '', 16)}
          </button>
          <a href="#/chamados" class="btn btn-primary btn-header-action" title="Nova ordem de serviço">
            ${iconHTML('plus', '', 15)}<span>Nova OS</span>
          </a>
          <div class="header-user-badge">
            <span class="user-avatar-circle" title="${currentUser?.nome ?? 'Usuário'}">${initials}</span>
            <button id="header-logout-btn" class="header-logout-btn" type="button" title="Sair da conta" aria-label="Sair">
              ${iconHTML('log-out', '', 14)}
            </button>
          </div>
        </div>
      </div>
    `;

    initIcons(this.element);

    const toggleBtn = this.element.querySelector('#mobile-menu-toggle');
    if (toggleBtn && this.onMobileMenuClick) {
      toggleBtn.addEventListener('click', () => {
        this.onMobileMenuClick!();
      });
    }

    const themeBtn = this.element.querySelector('#header-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        const configs = getStorageItem<AppConfiguration>(KEYS.CONFIGURACOES, {});
        setStorageItem(KEYS.CONFIGURACOES, { ...configs, theme: newTheme });
        Toast.info(`Modo ${newTheme === 'light' ? 'claro' : 'escuro'} ativado.`);
        const iconContainer = themeBtn as HTMLElement;
        iconContainer.innerHTML = iconHTML(newTheme === 'light' ? 'moon' : 'sun', '', 16);
        initIcons(iconContainer);
      });
    }

    const logoutBtn = this.element.querySelector('#header-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        history.replaceState(null, '', '#/login');
        window.location.reload();
      });
    }

    return this.element;
  }

  public updateTitle(route: Route): void {
    this.element.querySelectorAll('.nav-pill').forEach((pill) => {
      const pillRoute = pill.getAttribute('data-route');
      const isActive = pillRoute === route || (pillRoute === 'relatorios' && route.startsWith('relatorios'));
      pill.classList.toggle('active', isActive);
    });
  }
}
