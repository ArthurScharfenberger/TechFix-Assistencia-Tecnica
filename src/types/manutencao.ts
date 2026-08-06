export type StatusManutencao =
  | 'AGENDADA'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

export interface Manutencao {
  id: string;
  equipamentoId: string;
  descricao: string;
  tecnicoResponsavelId: string | null;
  tecnicoResponsavelNomeLegado?: string;
  custo: number;
  dataInicio: string;
  dataConclusao: string | null;
  status: StatusManutencao;
  criadoEm: string;
  atualizadoEm: string;
}

export type CriarManutencaoDTO = Omit<Manutencao, 'id' | 'criadoEm' | 'atualizadoEm' | 'dataConclusao' | 'tecnicoResponsavelNomeLegado'>;
export type AtualizarManutencaoDTO = Partial<Omit<Manutencao, 'id' | 'criadoEm'>>;
