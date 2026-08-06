export type CargoFuncionario = 'ATENDENTE' | 'TECNICO' | 'SUPERVISOR' | 'ADMINISTRADOR';
export type StatusFuncionario = 'ATIVO' | 'INATIVO';

export const ESPECIALIDADES_FUNCIONARIO = [
  'NOTEBOOKS', 'DESKTOPS', 'CELULARES', 'IMPRESSORAS', 'REDES',
  'SOFTWARE', 'RECUPERACAO_DADOS', 'ELETRONICA', 'OUTROS',
] as const;

export type EspecialidadeFuncionario = typeof ESPECIALIDADES_FUNCIONARIO[number];

export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: CargoFuncionario;
  especialidades: EspecialidadeFuncionario[];
  status: StatusFuncionario;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type CriarFuncionarioDTO = Omit<Funcionario, 'id' | 'criadoEm' | 'atualizadoEm'>;
export type AtualizarFuncionarioDTO = Partial<CriarFuncionarioDTO>;
