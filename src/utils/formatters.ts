import { StatusEquipamento, TipoEquipamento } from '../types/equipamento';
import { PrioridadeChamado, StatusChamado } from '../types/chamado';
import { StatusManutencao } from '../types/manutencao';
import { StatusUsuario } from '../types/usuario';

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function getTipoEquipamentoLabel(tipo: TipoEquipamento): string {
  const map: Record<TipoEquipamento, string> = {
    NOTEBOOK: 'Notebook',
    DESKTOP: 'Desktop',
    MONITOR: 'Monitor',
    IMPRESSORA: 'Impressora',
    CELULAR: 'Celular',
    OUTRO: 'Outro',
  };
  return map[tipo] || tipo;
}

export function getStatusEquipamentoBadge(status: StatusEquipamento): string {
  const map: Record<StatusEquipamento, { label: string; class: string }> = {
    DISPONIVEL: { label: 'Disponível', class: 'badge-success' },
    EM_USO: { label: 'Em Uso', class: 'badge-info' },
    EM_MANUTENCAO: { label: 'Em reparo', class: 'badge-warning' },
    DESCARTADO: { label: 'Descartado', class: 'badge-danger' },
  };
  const item = map[status] || { label: status, class: 'badge-neutral' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}

export function getStatusUsuarioBadge(status: StatusUsuario): string {
  const map: Record<StatusUsuario, { label: string; class: string }> = {
    ATIVO: { label: 'Ativo', class: 'badge-success' },
    INATIVO: { label: 'Inativo', class: 'badge-danger' },
  };
  const item = map[status] || { label: status, class: 'badge-neutral' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}

export function getStatusChamadoBadge(status: StatusChamado): string {
  const map: Record<StatusChamado, { label: string; class: string }> = {
    ABERTO: { label: 'Aberto', class: 'badge-info' },
    EM_ATENDIMENTO: { label: 'Em Atendimento', class: 'badge-warning' },
    AGUARDANDO_USUARIO: { label: 'Aguardando cliente', class: 'badge-purple' },
    CONCLUIDO: { label: 'Concluído', class: 'badge-success' },
    CANCELADO: { label: 'Cancelado', class: 'badge-neutral' },
  };
  const item = map[status] || { label: status, class: 'badge-neutral' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}

export function getPrioridadeChamadoBadge(prioridade: PrioridadeChamado): string {
  const map: Record<PrioridadeChamado, { label: string; class: string }> = {
    BAIXA: { label: 'Baixa', class: 'badge-neutral' },
    NORMAL: { label: 'Normal', class: 'badge-info' },
    ALTA: { label: 'Alta', class: 'badge-warning' },
    URGENTE: { label: 'Urgente', class: 'badge-danger badge-pulse' },
  };
  const item = map[prioridade] || { label: prioridade, class: 'badge-neutral' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}

export function getStatusManutencaoBadge(status: StatusManutencao): string {
  const map: Record<StatusManutencao, { label: string; class: string }> = {
    AGENDADA: { label: 'Agendada', class: 'badge-info' },
    EM_ANDAMENTO: { label: 'Em Andamento', class: 'badge-warning' },
    CONCLUIDA: { label: 'Concluída', class: 'badge-success' },
    CANCELADA: { label: 'Cancelada', class: 'badge-neutral' },
  };
  const item = map[status] || { label: status, class: 'badge-neutral' };
  return `<span class="badge ${item.class}">${item.label}</span>`;
}
