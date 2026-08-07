import { AuthAccount, AuthSession, LoginResult } from '../types/auth';
import { logger } from './logger';

const AUTH_ACCOUNTS_KEY = 'techFix_auth_accounts';
const LOCAL_SESSION_KEY = 'techFix_auth_session';
const SESSION_SESSION_KEY = 'techFix_auth_session_temporary';
const INTENDED_ROUTE_KEY = 'techFix_auth_intended_route';

const INITIAL_ADMIN: AuthAccount = {
  id: 'AUTH-ADMIN-DEMO',
  funcionarioId: null,
  nome: 'Administrador TechFix',
  email: 'admin@techfix.local',
  usuario: 'admin',
  senhaHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  podeAcessarSistema: true,
  status: 'ATIVO',
  cargo: 'ADMINISTRADOR',
};

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export class AuthService {
  public static initialize(): void {
    const accounts = readJson<AuthAccount[]>(localStorage, AUTH_ACCOUNTS_KEY);
    if (!accounts?.length) {
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify([INITIAL_ADMIN]));
      return;
    }

    const initialAdmin = accounts.find((account) => account.id === INITIAL_ADMIN.id);
    if (initialAdmin && initialAdmin.senhaHash !== INITIAL_ADMIN.senhaHash) {
      initialAdmin.senhaHash = INITIAL_ADMIN.senhaHash;
      localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }

  public static async login(identifier: string, password: string, keepConnected: boolean): Promise<LoginResult> {
    try {
      const normalized = identifier.trim().toLowerCase();
      const account = this.getAccounts().find(
        (item) => item.email.toLowerCase() === normalized || item.usuario.toLowerCase() === normalized
      );
      const passwordHash = await hashPassword(password);
      if (!account || account.senhaHash !== passwordHash) {
        logger.warn('Tentativa de login inválida.', { identifierType: normalized.includes('@') ? 'email' : 'usuario' });
        return { success: false, reason: 'INVALID_CREDENTIALS' };
      }
      if (account.status !== 'ATIVO') {
        logger.warn('Tentativa de login para usuário inativo.', { accountId: account.id });
        return { success: false, reason: 'INACTIVE' };
      }
      if (!account.podeAcessarSistema) {
        logger.warn('Tentativa de login sem permissão de acesso.', { accountId: account.id });
        return { success: false, reason: 'NO_ACCESS' };
      }
      const session: AuthSession = {
        accountId: account.id,
        funcionarioId: account.funcionarioId,
        nome: account.nome,
        cargo: account.cargo,
        iniciadoEm: new Date().toISOString(),
        sessionId: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.removeItem(SESSION_SESSION_KEY);
      (keepConnected ? localStorage : sessionStorage).setItem(
        keepConnected ? LOCAL_SESSION_KEY : SESSION_SESSION_KEY,
        JSON.stringify(session)
      );
      logger.info('Login realizado.', { accountId: account.id, persistent: keepConnected });
      return { success: true, session };
    } catch (error) {
      logger.error('Falha ao realizar login.', error);
      return { success: false, reason: 'ERROR' };
    }
  }

  public static logout(): void {
    const session = this.getCurrentUser();
    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(SESSION_SESSION_KEY);
    sessionStorage.removeItem(INTENDED_ROUTE_KEY);
    logger.info('Logout realizado.', { accountId: session?.accountId });
  }

  public static getCurrentUser(): AuthSession | null {
    const session = readJson<AuthSession>(sessionStorage, SESSION_SESSION_KEY)
      ?? readJson<AuthSession>(localStorage, LOCAL_SESSION_KEY);
    if (!session) return null;
    const account = this.getAccounts().find((item) => item.id === session.accountId);
    if (!account || account.status !== 'ATIVO' || !account.podeAcessarSistema) {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.removeItem(SESSION_SESSION_KEY);
      return null;
    }
    return session;
  }

  public static isAuthenticated(): boolean { return this.getCurrentUser() !== null; }

  public static preserveIntendedRoute(hash: string): void {
    if (/^#\/(dashboard|indicativos|equipamentos|usuarios|chamados|manutencoes|equipe|relatorios(?:\/(?:ordens|reparos|equipe|clientes-equipamentos))?)$/.test(hash)) {
      sessionStorage.setItem(INTENDED_ROUTE_KEY, hash);
    }
  }

  public static consumeIntendedRoute(): string {
    const route = sessionStorage.getItem(INTENDED_ROUTE_KEY) ?? '#/dashboard';
    sessionStorage.removeItem(INTENDED_ROUTE_KEY);
    return route;
  }

  private static getAccounts(): AuthAccount[] {
    return readJson<AuthAccount[]>(localStorage, AUTH_ACCOUNTS_KEY) ?? [];
  }
}
