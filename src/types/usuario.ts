export type StatusUsuario = 'ATIVO' | 'INATIVO';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  status: StatusUsuario;
  criadoEm: string;
  atualizadoEm: string;
}

export type CriarUsuarioDTO = Omit<Usuario, 'id' | 'criadoEm' | 'atualizadoEm'>;
export type AtualizarUsuarioDTO = Partial<CriarUsuarioDTO>;
