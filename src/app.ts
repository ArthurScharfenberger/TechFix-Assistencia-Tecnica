import { getCurrentRoute, getRouteTitle } from './utils/navigation';
import { SidebarComponent } from './components/sidebar';
import { HeaderComponent } from './components/header';
import { DashboardPage } from './pages/dashboard';
import { IndicativosPage } from './pages/indicativos';
import { EquipamentosPage } from './pages/equipamentos';
import { UsuariosPage } from './pages/usuarios';
import { ChamadosPage } from './pages/chamados';
import { ManutencoesPage } from './pages/manutencoes';
import { EquipePage } from './pages/equipe';
import { RelatoriosPage } from './pages/relatorios/relatorios';
import { RelatorioOrdensPage } from './pages/relatorios/relatorioOrdens';
import { RelatorioReparosPage } from './pages/relatorios/relatorioReparos';
import { RelatorioEquipePage } from './pages/relatorios/relatorioEquipe';
import { RelatorioClientesEquipamentosPage } from './pages/relatorios/relatorioClientesEquipamentos';
import { subscribeToStorage } from './services/storage';
import { initIcons } from './utils/iconHelper';
import { AuthService } from './services/authService';

export class App {
  private rootElement: HTMLElement;
  private sidebar: SidebarComponent;
  private header: HeaderComponent;
  private mainContentElement: HTMLElement;
  private overlayElement: HTMLElement;
  private appContainer: HTMLElement | null = null;
  private mobileMenuTrigger: HTMLElement | null = null;
  private currentPageComponent: any = null;

  constructor(rootId: string = 'app') {
    const root = document.getElementById(rootId);
    if (!root) throw new Error(`Root element #${rootId} not found.`);
    this.rootElement = root;

    this.sidebar = new SidebarComponent((collapsed) => this.applyDesktopSidebarState(collapsed));
    this.header = new HeaderComponent(() => this.toggleMobileSidebar());

    this.mainContentElement = document.createElement('main');
    this.mainContentElement.className = 'main-content';

    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'sidebar-overlay';
    this.overlayElement.addEventListener('click', () => this.closeMobileSidebar());
    document.addEventListener('keydown', (event) => {
      const sidebarEl = document.getElementById('app-sidebar');
      if (event.key === 'Escape' && !event.defaultPrevented) this.closeMobileSidebar(true);
      if (event.key === 'Tab' && sidebarEl?.classList.contains('open')) {
        const focusable = [...sidebarEl.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((item) => item.offsetParent !== null);
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    });
  }

  public init(): void {
    this.buildLayout();
    this.attachRouter();
    this.renderCurrentRoute();

    // Re-render current route whenever LocalStorage changes
    subscribeToStorage((key) => {
      if (key !== 'tiControl_configuracoes') this.renderCurrentRoute();
    });
  }

  private buildLayout(): void {
    this.rootElement.innerHTML = '';

    const appContainer = document.createElement('div');
    appContainer.className = `app-container${this.sidebar.isCollapsed() ? ' sidebar-collapsed' : ''}`;
    this.appContainer = appContainer;

    const sidebarEl = this.sidebar.render();
    if (window.matchMedia('(max-width: 1024px)').matches) sidebarEl.setAttribute('aria-hidden', 'true');
    const headerEl = this.header.render();

    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-wrapper';
    mainWrapper.appendChild(headerEl);
    mainWrapper.appendChild(this.mainContentElement);

    appContainer.appendChild(sidebarEl);
    appContainer.appendChild(mainWrapper);
    appContainer.appendChild(this.overlayElement);

    this.rootElement.appendChild(appContainer);
    this.mobileMenuTrigger = headerEl.querySelector('#mobile-menu-toggle');
    sidebarEl.addEventListener('click', (event) => { if ((event.target as Element).closest('.nav-item')) this.closeMobileSidebar(); });
    initIcons(appContainer);
  }

  private attachRouter(): void {
    window.addEventListener('hashchange', () => {
      this.renderCurrentRoute();
      this.closeMobileSidebar();
    });
  }

  private renderCurrentRoute(): void {
    if (!AuthService.isAuthenticated()) {
      AuthService.preserveIntendedRoute(window.location.hash);
      window.location.replace(`${window.location.pathname}${window.location.search}#/login`);
      return;
    }
    if (window.location.hash === '#/login') history.replaceState(null, '', '#/dashboard');
    const route = getCurrentRoute();

    if (this.currentPageComponent && typeof this.currentPageComponent.destroy === 'function') {
      this.currentPageComponent.destroy();
    }

    // Update document page title
    document.title = `${getRouteTitle(route)} | TechFix`;

    // Update sidebar active link & header title
    this.sidebar.updateActiveItem(route);
    this.header.updateTitle(route);

    // Clear content
    this.mainContentElement.innerHTML = '';

    // Render page
    switch (route) {
      case 'dashboard':
        this.currentPageComponent = new DashboardPage();
        break;
      case 'indicativos':
        this.currentPageComponent = new IndicativosPage();
        break;
      case 'equipamentos':
        this.currentPageComponent = new EquipamentosPage();
        break;
      case 'usuarios':
        this.currentPageComponent = new UsuariosPage();
        break;
      case 'chamados':
        this.currentPageComponent = new ChamadosPage();
        break;
      case 'manutencoes':
        this.currentPageComponent = new ManutencoesPage();
        break;
      case 'equipe':
        this.currentPageComponent = new EquipePage();
        break;
      case 'relatorios':
        this.currentPageComponent = new RelatoriosPage();
        break;
      case 'relatorios/ordens':
        this.currentPageComponent = new RelatorioOrdensPage();
        break;
      case 'relatorios/reparos':
        this.currentPageComponent = new RelatorioReparosPage();
        break;
      case 'relatorios/equipe':
        this.currentPageComponent = new RelatorioEquipePage();
        break;
      case 'relatorios/clientes-equipamentos':
        this.currentPageComponent = new RelatorioClientesEquipamentosPage();
        break;
      default:
        this.currentPageComponent = new DashboardPage();
        break;
    }

    if (this.currentPageComponent) {
      const pageEl = this.currentPageComponent.render();
      this.mainContentElement.appendChild(pageEl);
      // Pages are rendered dynamically after route and storage changes.
      // Convert every newly inserted Lucide placeholder only after it is in the DOM.
      initIcons(pageEl);
    }
  }

  private toggleMobileSidebar(): void {
    const sidebarEl = document.getElementById('app-sidebar');
    if (sidebarEl) {
      const isOpen = sidebarEl.classList.toggle('open');
      if (isOpen) {
        this.overlayElement.classList.add('show');
        document.body.classList.add('sidebar-drawer-open');
        sidebarEl.setAttribute('aria-hidden', 'false');
        this.mobileMenuTrigger?.setAttribute('aria-expanded', 'true');
        (sidebarEl.querySelector('.nav-item') as HTMLElement | null)?.focus();
      } else {
        this.closeMobileSidebar(true);
      }
    }
  }

  private closeMobileSidebar(restoreFocus = false): void {
    const sidebarEl = document.getElementById('app-sidebar');
    if (sidebarEl) {
      sidebarEl.classList.remove('open');
      this.overlayElement.classList.remove('show');
      document.body.classList.remove('sidebar-drawer-open');
      this.mobileMenuTrigger?.setAttribute('aria-expanded', 'false');
      const mobile = window.matchMedia('(max-width: 1024px)').matches;
      if (mobile) sidebarEl.setAttribute('aria-hidden', 'true'); else sidebarEl.removeAttribute('aria-hidden');
      if (restoreFocus && mobile) this.mobileMenuTrigger?.focus();
    }
  }

  private applyDesktopSidebarState(collapsed: boolean): void {
    this.appContainer?.classList.toggle('sidebar-collapsed', collapsed);
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 230);
  }
}
