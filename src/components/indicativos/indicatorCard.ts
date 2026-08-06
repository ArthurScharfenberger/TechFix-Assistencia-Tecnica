import { IndicadorPrincipal } from '../../types/indicativos';
import { iconHTML } from '../../utils/iconHelper';

export function renderIndicatorCard(indicator: IndicadorPrincipal): string {
  const comparison = indicator.comparacao;
  const comparisonHtml = comparison.percentual === null
    ? '<span class="metric-comparison neutral">Sem base anterior</span>'
    : `<span class="metric-comparison ${comparison.melhorou === null ? 'neutral' : comparison.melhorou ? 'positive' : 'negative'}">
        ${iconHTML(comparison.percentual >= 0 ? 'trending-up' : 'trending-down', '', 13)}
        ${comparison.percentual >= 0 ? '+' : ''}${comparison.percentual.toFixed(1)}% vs. período anterior
      </span>`;
  return `<article class="card indicator-card ${indicator.variante}">
    <div class="indicator-card-top"><span class="stat-label">${indicator.titulo}</span><span class="stat-icon ${indicator.variante === 'accent' ? 'teal' : indicator.variante}">${iconHTML(indicator.icone, '', 21)}</span></div>
    <strong class="indicator-value">${indicator.valor}</strong>
    <span class="stat-description">${indicator.descricao}</span>
    ${comparisonHtml}
  </article>`;
}
