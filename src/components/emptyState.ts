import { iconHTML } from '../utils/iconHelper';

export function renderEmptyState(
  title: string = 'Nenhum registro encontrado',
  description: string = 'Não foram encontrados dados para os critérios ou filtros selecionados.',
  iconName: string = 'inbox'
): string {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        ${iconHTML(iconName, '', 32)}
      </div>
      <h4 class="empty-state-title">${title}</h4>
      <p class="empty-state-desc">${description}</p>
    </div>
  `;
}
