import { logger, LOG_STORAGE_KEY } from './logger';

export const KEYS = {
  USUARIOS: 'tiControl_usuarios',
  EQUIPAMENTOS: 'tiControl_equipamentos',
  CHAMADOS: 'tiControl_chamados',
  MANUTENCOES: 'tiControl_manutencoes',
  CONFIGURACOES: 'tiControl_configuracoes',
  CONTADOR_EQUIPAMENTOS: 'techfix_contador_equipamentos',
  FUNCIONARIOS: 'tiControl_funcionarios',
} as const;

export interface AppConfiguration {
  theme?: string;
  sidebarCollapsed?: boolean;
}

export const OPERATIONAL_STORAGE_KEYS = [
  KEYS.USUARIOS,
  KEYS.EQUIPAMENTOS,
  KEYS.CHAMADOS,
  KEYS.MANUTENCOES,
  KEYS.CONTADOR_EQUIPAMENTOS,
  KEYS.FUNCIONARIOS,
  LOG_STORAGE_KEY,
] as const;

const SESSION_STORAGE_KEYS = ['techFix_indicativosFiltros'] as const;

type StorageChangeListener = (key: string) => void;
const listeners: StorageChangeListener[] = [];

export function subscribeToStorage(listener: StorageChangeListener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners(key: string): void {
  listeners.forEach((listener) => listener(key));
}

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    logger.error('Falha ao ler dados locais.', error, { key, operation: 'read' });
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners(key);
    logger.info('Dados locais atualizados.', { key, operation: 'write' });
  } catch (error) {
    logger.error('Falha ao gravar dados locais.', error, { key, operation: 'write' });
  }
}

export function setStorageItems(items: Array<readonly [string, unknown]>): void {
  try {
    items.forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
    notifyListeners('techfix_batch_update');
    logger.info('Dados locais atualizados em lote.', { keys: items.map(([key]) => key), operation: 'batch-write' });
  } catch (error) {
    logger.error('Falha ao gravar dados locais em lote.', error, { operation: 'batch-write' });
    throw error;
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
    notifyListeners(key);
    logger.info('Dados locais removidos.', { key, operation: 'remove' });
  } catch (error) {
    logger.error('Falha ao remover dados locais.', error, { key, operation: 'remove' });
  }
}

export function clearTechFixData(): void {
  try {
    OPERATIONAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    SESSION_STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
    // Uma única notificação evita renderizações intermediárias com relações parcialmente removidas.
    notifyListeners('techfix_data_cleared');
  } catch (error) {
    logger.error('Falha ao limpar dados operacionais.', error, { operation: 'clear-operational-data' });
    throw error;
  }
}
