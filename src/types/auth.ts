import { CargoFuncionario, StatusFuncionario } from './funcionario';

export interface AuthAccount {
  id: string;
  funcionarioId: string | null;
  nome: string;
  email: string;
  usuario: string;
  senhaHash: string;
  podeAcessarSistema: boolean;
  status: StatusFuncionario;
  cargo: CargoFuncionario;
}

export interface AuthSession {
  accountId: string;
  funcionarioId: string | null;
  nome: string;
  cargo: CargoFuncionario;
  iniciadoEm: string;
  sessionId: string;
}

export type LoginResult =
  | { success: true; session: AuthSession }
  | { success: false; reason: 'INVALID_CREDENTIALS' | 'INACTIVE' | 'NO_ACCESS' | 'ERROR' };
