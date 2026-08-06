export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
}

export const LOG_STORAGE_KEY = 'techFix_logs';
const MAX_LOG_ENTRIES = 500;
const MAX_CONTEXT_LENGTH = 10_000;
let globalHandlersInstalled = false;

function serializeError(error: unknown): LogEntry['error'] | undefined {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack };
  if (error === undefined || error === null) return undefined;
  return { name: 'UnknownError', message: String(error) };
}

function safeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined;
  try {
    const serialized = JSON.stringify(context);
    return serialized.length <= MAX_CONTEXT_LENGTH
      ? context
      : { truncated: true, preview: serialized.slice(0, MAX_CONTEXT_LENGTH) };
  } catch {
    return { serializationError: 'O contexto do log não pôde ser serializado.' };
  }
}

function readLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entry: LogEntry): void {
  const method = entry.level === 'ERROR' ? 'error' : entry.level === 'WARN' ? 'warn' : 'info';
  console[method](`[${entry.level}] ${entry.message}`, entry.context ?? '', entry.error ?? '');
  try {
    const logs = readLogs();
    logs.push(entry);
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs.slice(-MAX_LOG_ENTRIES)));
  } catch (storageError) {
    console.error('[LOGGER] Não foi possível persistir o registro.', storageError);
  }
}

function log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): void {
  write({
    timestamp: new Date().toISOString(),
    level,
    message,
    context: safeContext(context),
    error: serializeError(error),
  });
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void => log('DEBUG', message, context),
  info: (message: string, context?: Record<string, unknown>): void => log('INFO', message, context),
  warn: (message: string, context?: Record<string, unknown>, error?: unknown): void => log('WARN', message, context, error),
  error: (message: string, error?: unknown, context?: Record<string, unknown>): void => log('ERROR', message, context, error),
};

export function installGlobalErrorHandlers(): void {
  if (globalHandlersInstalled) return;
  globalHandlersInstalled = true;
  window.addEventListener('error', (event) => {
    logger.error('Erro não tratado na aplicação.', event.error ?? event.message, {
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      route: window.location.hash,
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Promise rejeitada sem tratamento.', event.reason, { route: window.location.hash });
  });
}

export function exportLogs(): number {
  const logs = readLogs();
  if (logs.length === 0) return 0;
  const contents = logs.map((entry) => JSON.stringify(entry)).join('\n');
  const blob = new Blob([contents], { type: 'application/x-ndjson;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `techfix-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`;
  link.click();
  URL.revokeObjectURL(url);
  return logs.length;
}

export function clearLogs(): void {
  localStorage.removeItem(LOG_STORAGE_KEY);
}
