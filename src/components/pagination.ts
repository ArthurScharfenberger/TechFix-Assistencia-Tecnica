import { iconHTML } from '../utils/iconHelper';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function calculatePagination<T>(
  items: T[],
  currentPage: number,
  pageSize: number
): {
  paginatedItems: T[];
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
} {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalPages,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: endIndex,
    totalItems,
  };
}

export function renderPaginationControls(
  currentPage: number,
  totalPages: number,
  startItem: number,
  endItem: number,
  totalItems: number
): string {
  if (totalItems === 0) return '';

  let pageButtonsHtml = '';

  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageButtonsHtml += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  return `
    <div class="pagination-wrapper">
      <div class="pagination-info">
        Exibindo <strong>${startItem}</strong> a <strong>${endItem}</strong> de <strong>${totalItems}</strong> registros
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Página anterior">
          ${iconHTML('chevron-left', '', 16)}
        </button>
        ${pageButtonsHtml}
        <button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''} aria-label="Próxima página">
          ${iconHTML('chevron-right', '', 16)}
        </button>
      </div>
    </div>
  `;
}
