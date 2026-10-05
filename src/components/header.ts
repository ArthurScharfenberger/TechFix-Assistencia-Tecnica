import { getCurrentRoute, Route } from '../utils/navigation';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { AuthService } from '../services/authService';
import { escapeHtml } from '../utils/inputBehavior';
import logoUrl from '../img/logo.png';

export class HeaderComponent {
  private element = document.createElement('header');
  constructor(private onMobileMenuClick?: () => void, private onSettingsClick?: () => void) { this.element.className='header'; }

  public render(): HTMLElement {
    const user=AuthService.getCurrentUser();
    const initials=user?.nome.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase() ?? 'TF';
    const links: Array<[Route,string]>=[['dashboard','Oficina'],['usuarios','Clientes'],['equipamentos','Equipamentos'],['equipe','Equipe'],['relatorios','Relatórios']];
    this.element.innerHTML=`<div class="header-inner">
      <div class="header-brand-group"><button id="mobile-menu-toggle" class="mobile-menu-btn" aria-label="Abrir menu" aria-controls="app-sidebar" aria-expanded="false">${iconHTML('menu','',24)}</button><a href="#/dashboard" class="header-logo-link" aria-label="TechFix — Oficina"><span class="official-logo-crop"><img src="${logoUrl}" alt="TechFix — Assistência Técnica"></span></a></div>
      <nav class="header-nav-island" aria-label="Navegação principal">${links.map(([route,label])=>`<a href="#/${route}" class="nav-pill" data-route="${route}">${label}</a>`).join('')}
        <details class="header-more"><summary>Mais</summary><div><a href="#/chamados" class="nav-pill" data-route="chamados">Ordens de serviço</a><a href="#/manutencoes" class="nav-pill" data-route="manutencoes">Reparos</a><a href="#/indicativos" class="nav-pill" data-route="indicativos">Indicadores</a></div></details>
      </nav>
      <div class="header-actions-group"><details class="header-account"><summary aria-label="Menu da conta de ${escapeHtml(user?.nome ?? 'Usuário')}"><span class="user-avatar-circle">${escapeHtml(initials)}</span></summary><div><strong>${escapeHtml(user?.nome ?? 'Usuário')}</strong><button id="header-logout-btn" type="button">${iconHTML('log-out','',16)} Sair da conta</button></div></details><button id="header-settings-btn" class="header-tool-btn" aria-label="Abrir configurações" aria-controls="app-sidebar" aria-expanded="false">${iconHTML('settings','',26)}</button></div>
    </div>`;
    initIcons(this.element);
    this.element.querySelector('#mobile-menu-toggle')?.addEventListener('click',()=>this.onMobileMenuClick?.());
    this.element.querySelector('#header-settings-btn')?.addEventListener('click',()=>this.onSettingsClick?.());
    this.element.querySelector('#header-logout-btn')?.addEventListener('click',()=> { AuthService.logout();history.replaceState(null,'','#/login');window.location.reload(); });
    this.element.addEventListener('keydown',event=> { if(event.key==='Escape') this.closeMenus(); });
    this.updateTitle(getCurrentRoute());
    return this.element;
  }

  private closeMenus(): void {
    this.element.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu=> { menu.open=false;menu.querySelector<HTMLElement>('summary')?.focus(); });
  }

  public updateTitle(route: Route): void {
    this.element.querySelectorAll<HTMLElement>('[data-route]').forEach(link=> {
      const active=link.dataset.route===route || (link.dataset.route==='relatorios' && route.startsWith('relatorios/'));
      link.classList.toggle('active',active);
      if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    this.element.querySelector('.header-more')?.classList.toggle('active',['chamados','manutencoes','indicativos'].includes(route));
    this.element.querySelectorAll<HTMLDetailsElement>('details').forEach(menu=>menu.open=false);
  }
}
