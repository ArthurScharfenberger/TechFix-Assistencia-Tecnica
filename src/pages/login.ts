import { AuthService } from '../services/authService';
import { iconHTML, initIcons } from '../utils/iconHelper';
import techFixLogoUrl from '../img/techfix-logo-transparent.png';

const LOGIN_MESSAGES = {
  INVALID_CREDENTIALS: 'Email, usuário ou senha incorretos.',
  INACTIVE: 'Este usuário está inativo.',
  NO_ACCESS: 'Este usuário não possui permissão para acessar o sistema.',
  ERROR: 'Não foi possível realizar o login.',
} as const;

export class LoginPage {
  private container = document.createElement('main');
  private submitting = false;

  public render(): HTMLElement {
    document.title = 'Acessar | TechFix';
    this.container.className = 'login-page';
    this.container.innerHTML = `
      <section class="login-brand-panel" aria-label="TechFix Assistência Técnica">
        <div class="login-brand-content">
          <img src="${techFixLogoUrl}" alt="TechFix — Assistência Técnica" class="login-brand-logo" />
          <h2>Sua assistência técnica, organizada.</h2>
        </div>
      </section>
      <section class="login-form-panel">
        <div class="login-card">
          <img src="${techFixLogoUrl}" alt="TechFix" class="login-mobile-logo" />
          <div class="login-card-heading"><span class="login-card-icon" aria-hidden="true">${iconHTML('log-in', '', 24)}</span><div><h1>Entrar</h1><p>Acesse o TechFix</p></div></div>
          <form id="login-form" novalidate>
            <div id="login-general-error" class="login-general-error" role="alert" hidden></div>
            <div class="form-group login-identifier-group">
              <label class="form-label" for="login-identifier">Email ou usuário</label>
              <div class="login-input-wrap"><span aria-hidden="true">${iconHTML('user', '', 18)}</span><input id="login-identifier" name="identifier" class="form-control" type="text" autocomplete="username" placeholder="Email ou usuário" aria-describedby="login-identifier-error" /></div>
              <span id="login-identifier-error" class="form-error" role="alert"></span>
            </div>
            <div class="form-group login-password-group">
              <label class="form-label" for="login-password">Senha</label>
              <div class="login-input-wrap"><span aria-hidden="true">${iconHTML('lock-keyhole', '', 18)}</span><input id="login-password" name="password" class="form-control" type="password" autocomplete="current-password" placeholder="Senha" aria-describedby="login-password-error" /><button id="password-toggle" class="login-password-toggle" type="button" aria-label="Mostrar senha">${iconHTML('eye', '', 18)}</button></div>
              <span id="login-password-error" class="form-error" role="alert"></span>
            </div>
            <label class="login-remember"><input id="keep-connected" type="checkbox" /> <span>Manter conectado</span></label>
            <button id="login-submit" class="btn btn-primary login-submit" type="submit"><span>Entrar</span></button>
          </form>
          <div class="login-card-footer"><span aria-hidden="true">${iconHTML('lock-keyhole', '', 13)}</span><span>Acesso interno</span></div>
        </div>
      </section>`;
    initIcons(this.container);
    this.attachEvents();
    return this.container;
  }

  private attachEvents(): void {
    const form = this.container.querySelector<HTMLFormElement>('#login-form')!;
    const identifier = this.container.querySelector<HTMLInputElement>('#login-identifier')!;
    const password = this.container.querySelector<HTMLInputElement>('#login-password')!;
    const toggle = this.container.querySelector<HTMLButtonElement>('#password-toggle')!;
    [identifier, password].forEach((input) => input.addEventListener('input', () => {
      this.setFieldError(input.id === 'login-identifier' ? 'identifier' : 'password', '');
      this.setGeneralError('');
    }));
    toggle.addEventListener('click', () => {
      const visible = password.type === 'text';
      password.type = visible ? 'password' : 'text';
      toggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
      toggle.innerHTML = iconHTML(visible ? 'eye' : 'eye-off', '', 18);
      initIcons(toggle);
      password.focus();
    });
    form.addEventListener('submit', (event) => { event.preventDefault(); void this.submit(identifier, password); });
    identifier.focus();
  }

  private async submit(identifier: HTMLInputElement, password: HTMLInputElement): Promise<void> {
    if (this.submitting) return;
    const identifierValue = identifier.value.trim();
    const passwordValue = password.value;
    this.setFieldError('identifier', identifierValue ? '' : 'Informe seu email ou usuário.');
    this.setFieldError('password', passwordValue ? '' : 'Informe sua senha.');
    if (!identifierValue || !passwordValue) return;
    this.submitting = true;
    const button = this.container.querySelector<HTMLButtonElement>('#login-submit')!;
    button.disabled = true; button.innerHTML = `${iconHTML('loader-circle', 'login-spinner', 18)}<span>Entrando...</span>`; initIcons(button);
    const keepConnected = this.container.querySelector<HTMLInputElement>('#keep-connected')!.checked;
    const result = await AuthService.login(identifierValue, passwordValue, keepConnected);
    password.value = '';
    if (result.success) {
      history.replaceState(null, '', AuthService.consumeIntendedRoute());
      window.dispatchEvent(new Event('techfix:authenticated'));
      return;
    }
    this.setGeneralError(LOGIN_MESSAGES[result.reason]);
    this.submitting = false; button.disabled = false; button.textContent = 'Entrar'; password.focus();
  }

  private setFieldError(field: 'identifier' | 'password', message: string): void {
    const input = this.container.querySelector<HTMLInputElement>(`#login-${field}`)!;
    const error = this.container.querySelector<HTMLElement>(`#login-${field}-error`)!;
    error.textContent = message; input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  private setGeneralError(message: string): void {
    const error = this.container.querySelector<HTMLElement>('#login-general-error')!;
    error.textContent = message; error.hidden = !message;
  }
}
