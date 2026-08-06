import { iconHTML, initIcons } from '../utils/iconHelper';

export interface ModalOptions {
  title: string;
  content: string | HTMLElement;
  footerButtons?: Array<{
    text: string;
    class?: string;
    onClick: (modal: Modal) => void;
  }>;
  onClose?: () => void;
}

export class Modal {
  private backdropEl: HTMLElement | null = null;
  private escListener: ((e: KeyboardEvent) => void) | null = null;
  private options: ModalOptions;

  constructor(options: ModalOptions) {
    this.options = options;
  }

  public open(): void {
    const container = document.getElementById('modal-container');
    if (!container) return;

    // Create backdrop
    this.backdropEl = document.createElement('div');
    this.backdropEl.className = 'modal-backdrop';

    const cardEl = document.createElement('div');
    cardEl.className = 'modal-card';
    cardEl.setAttribute('role', 'dialog');
    cardEl.setAttribute('aria-modal', 'true');
    cardEl.setAttribute('tabindex', '-1');

    // Header
    const headerEl = document.createElement('div');
    headerEl.className = 'modal-header';
    headerEl.innerHTML = `
      <h3 class="modal-title" id="modal-title">${this.options.title}</h3>
      <button type="button" class="btn-icon modal-close-btn" aria-label="Fechar">${iconHTML('x', '', 20)}</button>
    `;
    cardEl.setAttribute('aria-labelledby', 'modal-title');

    // Body
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal-body';
    if (typeof this.options.content === 'string') {
      bodyEl.innerHTML = this.options.content;
    } else {
      bodyEl.appendChild(this.options.content);
      if (this.options.content instanceof HTMLFormElement) {
        this.options.content.addEventListener('submit', (event) => event.preventDefault());
      }
    }

    // Footer
    const footerEl = document.createElement('div');
    footerEl.className = 'modal-footer';

    if (this.options.footerButtons && this.options.footerButtons.length > 0) {
      this.options.footerButtons.forEach((btnConfig) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn ${btnConfig.class || 'btn-secondary'}`;
        btn.textContent = btnConfig.text;
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          btn.disabled = true;
          try {
            btnConfig.onClick(this);
          } finally {
            window.setTimeout(() => { if (btn.isConnected) btn.disabled = false; }, 500);
          }
        });
        footerEl.appendChild(btn);
      });
    } else {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'btn btn-secondary';
      closeBtn.textContent = 'Fechar';
      closeBtn.addEventListener('click', () => this.close());
      footerEl.appendChild(closeBtn);
    }

    cardEl.appendChild(headerEl);
    cardEl.appendChild(bodyEl);
    cardEl.appendChild(footerEl);
    this.backdropEl.appendChild(cardEl);
    container.appendChild(this.backdropEl);

    initIcons(this.backdropEl);

    // Initial focus on first input or first action button
    setTimeout(() => {
      if (this.backdropEl) {
        this.backdropEl.classList.add('active');
        const focusable = this.backdropEl.querySelector<HTMLElement>(
          'input, select, textarea, button:not(.modal-close-btn)'
        );
        if (focusable) focusable.focus();
      }
    }, 10);

    // Close listeners
    const headerClose = headerEl.querySelector('.modal-close-btn');
    if (headerClose) {
      headerClose.addEventListener('click', () => this.close());
    }

    this.backdropEl.addEventListener('click', (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });

    this.escListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escListener);
  }

  public close(): void {
    if (!this.backdropEl) return;

    this.backdropEl.classList.remove('active');
    if (this.escListener) {
      document.removeEventListener('keydown', this.escListener);
    }

    setTimeout(() => {
      if (this.backdropEl && this.backdropEl.parentNode) {
        this.backdropEl.parentNode.removeChild(this.backdropEl);
      }
      this.backdropEl = null;
      if (this.options.onClose) {
        this.options.onClose();
      }
    }, 200);
  }

  public getElement(): HTMLElement | null {
    return this.backdropEl;
  }
}
