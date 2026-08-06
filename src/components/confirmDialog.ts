import { Modal } from './modal';
import { iconHTML } from '../utils/iconHelper';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'secondary';
  onConfirm: () => void;
  onCancel?: () => void;
}

export class ConfirmDialog {
  public static show(options: ConfirmDialogOptions): void {
    const variantClass =
      options.confirmVariant === 'danger'
        ? 'btn-danger'
        : options.confirmVariant === 'primary'
        ? 'btn-primary'
        : 'btn-secondary';

    const contentHtml = `
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <div style="color: ${options.confirmVariant === 'danger' ? 'var(--color-danger)' : 'var(--accent-primary)'}; flex-shrink: 0; margin-top: 0.2rem;">
          ${iconHTML(options.confirmVariant === 'danger' ? 'alert-triangle' : 'help-circle', '', 28)}
        </div>
        <div style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main);">
          ${options.message}
        </div>
      </div>
    `;

    const modal = new Modal({
      title: options.title,
      content: contentHtml,
      footerButtons: [
        {
          text: options.cancelText || 'Cancelar',
          class: 'btn-secondary',
          onClick: (m) => {
            m.close();
            if (options.onCancel) options.onCancel();
          },
        },
        {
          text: options.confirmText || 'Confirmar',
          class: variantClass,
          onClick: (m) => {
            m.close();
            options.onConfirm();
          },
        },
      ],
    });

    modal.open();
  }
}
