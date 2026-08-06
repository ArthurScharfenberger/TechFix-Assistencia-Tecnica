import { iconHTML, initIcons } from '../utils/iconHelper';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export class Toast {
  public static show(message: string, type: ToastType = 'info', durationMs: number = 3500): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap: Record<ToastType, string> = {
      success: 'check-circle-2',
      error: 'alert-triangle',
      warning: 'alert-circle',
      info: 'info',
    };

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    toastEl.innerHTML = `
      <div class="toast-icon">${iconHTML(iconMap[type], '', 20)}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Fechar">${iconHTML('x', '', 16)}</button>
    `;

    container.appendChild(toastEl);
    initIcons(toastEl);

    const closeBtn = toastEl.querySelector('.toast-close');
    const removeToast = () => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(100%)';
      toastEl.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
      }, 250);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', removeToast);
    }

    if (durationMs > 0) {
      setTimeout(removeToast, durationMs);
    }
  }

  public static success(message: string): void {
    this.show(message, 'success');
  }

  public static error(message: string): void {
    this.show(message, 'error');
  }

  public static warning(message: string): void {
    this.show(message, 'warning');
  }

  public static info(message: string): void {
    this.show(message, 'info');
  }
}
