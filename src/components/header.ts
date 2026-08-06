import { getRouteTitle, getRouteDescription, getCurrentRoute, Route } from '../utils/navigation';
import { iconHTML, initIcons } from '../utils/iconHelper';

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
    const title = getRouteTitle(currentRoute);

    this.element.innerHTML = `
      <div class="header-left">
        <button id="mobile-menu-toggle" class="mobile-menu-btn" aria-label="Abrir menu" aria-controls="app-sidebar" aria-expanded="false">
          ${iconHTML('menu', '', 22)}
        </button>
        <div class="header-title-group">
          <div class="breadcrumb-trail"><span>TechFix</span><span aria-hidden="true">/</span><span id="header-breadcrumb">${title}</span></div>
          <h1 class="page-title" id="header-page-title">${title}</h1>
          <p class="page-description" id="header-page-description">${getRouteDescription(currentRoute)}</p>
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

    return this.element;
  }

  public updateTitle(route: Route): void {
    const titleEl = this.element.querySelector('#header-page-title');
    if (titleEl) {
      titleEl.textContent = getRouteTitle(route);
    }
    const breadcrumbEl = this.element.querySelector('#header-breadcrumb');
    if (breadcrumbEl) breadcrumbEl.textContent = getRouteTitle(route);
    const descriptionEl = this.element.querySelector('#header-page-description');
    if (descriptionEl) descriptionEl.textContent = getRouteDescription(route);
  }
}
