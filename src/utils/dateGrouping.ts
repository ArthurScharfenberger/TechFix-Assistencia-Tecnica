import { AgrupamentoTemporal, IntervaloDatas, PeriodoRapido } from '../types/indicativos';

const DAY_MS = 86_400_000;

function startOfDay(date: Date): Date { const result = new Date(date); result.setHours(0, 0, 0, 0); return result; }
function endOfDay(date: Date): Date { const result = new Date(date); result.setHours(23, 59, 59, 999); return result; }
function addDays(date: Date, days: number): Date { const result = new Date(date); result.setDate(result.getDate() + days); return result; }

export function parseDate(value: string | null | undefined, end = false): Date | null {
  if (!value) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return end ? endOfDay(date) : date;
}

export function getIntervalo(periodo: PeriodoRapido, dataInicial = '', dataFinal = '', now = new Date()): IntervaloDatas {
  const today = startOfDay(now);
  switch (periodo) {
    case 'HOJE': return { inicio: today, fim: endOfDay(today) };
    case 'ONTEM': { const day = addDays(today, -1); return { inicio: day, fim: endOfDay(day) }; }
    case 'ULTIMOS_7_DIAS': return { inicio: addDays(today, -6), fim: endOfDay(today) };
    case 'ULTIMOS_30_DIAS': return { inicio: addDays(today, -29), fim: endOfDay(today) };
    case 'ULTIMOS_90_DIAS': return { inicio: addDays(today, -89), fim: endOfDay(today) };
    case 'ESTE_MES': return { inicio: new Date(today.getFullYear(), today.getMonth(), 1), fim: endOfDay(today) };
    case 'MES_ANTERIOR': return { inicio: new Date(today.getFullYear(), today.getMonth() - 1, 1), fim: endOfDay(new Date(today.getFullYear(), today.getMonth(), 0)) };
    case 'ESTE_ANO': return { inicio: new Date(today.getFullYear(), 0, 1), fim: endOfDay(today) };
    case 'ANO_ANTERIOR': return { inicio: new Date(today.getFullYear() - 1, 0, 1), fim: endOfDay(new Date(today.getFullYear() - 1, 11, 31)) };
    case 'PERSONALIZADO': {
      const inicio = parseDate(dataInicial) ?? today;
      const fim = parseDate(dataFinal, true) ?? endOfDay(inicio);
      return inicio <= fim ? { inicio: startOfDay(inicio), fim } : { inicio: startOfDay(fim), fim: endOfDay(inicio) };
    }
  }
}

export function getIntervaloAnterior(intervalo: IntervaloDatas, periodo?: PeriodoRapido): IntervaloDatas {
  if (periodo === 'ESTE_MES' || periodo === 'MES_ANTERIOR') {
    const previousMonthEnd = endOfDay(new Date(intervalo.inicio.getFullYear(), intervalo.inicio.getMonth(), 0));
    return { inicio: new Date(previousMonthEnd.getFullYear(), previousMonthEnd.getMonth(), 1), fim: previousMonthEnd };
  }
  if (periodo === 'ESTE_ANO' || periodo === 'ANO_ANTERIOR') {
    const year = intervalo.inicio.getFullYear() - 1;
    return { inicio: new Date(year, 0, 1), fim: endOfDay(new Date(year, 11, 31)) };
  }
  const duration = intervalo.fim.getTime() - intervalo.inicio.getTime() + 1;
  return { inicio: new Date(intervalo.inicio.getTime() - duration), fim: new Date(intervalo.inicio.getTime() - 1) };
}

export function isInInterval(value: string | null | undefined, intervalo: IntervaloDatas): boolean {
  const date = parseDate(value);
  return !!date && date >= intervalo.inicio && date <= intervalo.fim;
}

function isoWeek(date: Date): { year: number; week: number } {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return { year: utc.getUTCFullYear(), week: Math.ceil((((utc.getTime() - yearStart.getTime()) / DAY_MS) + 1) / 7) };
}

export function getGroupKey(value: string, grouping: AgrupamentoTemporal): string | null {
  const date = parseDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (grouping === 'DIA') return `${year}-${month}-${day}`;
  if (grouping === 'MES') return `${year}-${month}`;
  if (grouping === 'ANO') return String(year);
  const week = isoWeek(date);
  return `${week.year}-S${String(week.week).padStart(2, '0')}`;
}

export function formatGroupLabel(key: string, grouping: AgrupamentoTemporal): string {
  if (grouping === 'DIA') return new Date(`${key}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  if (grouping === 'MES') { const [year, month] = key.split('-'); return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }); }
  if (grouping === 'SEMANA') return key.replace('-S', ' · sem. ');
  return key;
}

export function formatIntervalo(intervalo: IntervaloDatas): string {
  const format = (date: Date): string => date.toLocaleDateString('pt-BR');
  return `${format(intervalo.inicio)} a ${format(intervalo.fim)}`;
}

export function durationHours(start: string, end: string | null): number | null {
  const first = parseDate(start); const last = parseDate(end);
  if (!first || !last || last < first) return null;
  return (last.getTime() - first.getTime()) / 3_600_000;
}

export function formatDuration(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return 'Sem dados';
  return hours < 48 ? `${hours.toFixed(hours < 10 ? 1 : 0)} h` : `${(hours / 24).toFixed(1)} dias`;
}
