export type PrioridadeChamado = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export type StatusChamado =
  | 'ABERTO'
  | 'EM_ATENDIMENTO'
  | 'AGUARDANDO_USUARIO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  clienteId: string;
  equipamentoId: string;
  prioridade: PrioridadeChamado;
  status: StatusChamado;
  tecnicoResponsavelId: string | null;
  tecnicoResponsavelNomeLegado?: string;
  criadoEm: string;
  atualizadoEm: string;
  concluidoEm: string | null;
}

export type CriarChamadoDTO = Omit<Chamado, 'id' | 'criadoEm' | 'atualizadoEm' | 'concluidoEm' | 'tecnicoResponsavelNomeLegado'>;
export type AtualizarChamadoDTO = Partial<Omit<Chamado, 'id' | 'criadoEm'>>;
