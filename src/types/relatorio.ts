import { PeriodoRapido, IntervaloDatas } from './indicativos';

export type TipoRelatorio = 'ORDENS' | 'REPAROS' | 'EQUIPE' | 'CLIENTES_EQUIPAMENTOS';
export type RelatorioRoute = 'relatorios' | 'relatorios/ordens' | 'relatorios/reparos' | 'relatorios/equipe' | 'relatorios/clientes-equipamentos';

export interface FiltrosRelatorio {
  periodo: PeriodoRapido;
  dataInicial: string;
  dataFinal: string;
  status: string;
  prioridade: string;
  clienteId: string;
  equipamentoId: string;
  tecnicoId: string;
  cargo: string;
  especialidade: string;
  valorMinimo: string;
  valorMaximo: string;
  quantidadeMinima: string;
  pesquisa: string;
}

export interface ResultadoRelatorio<T> {
  intervalo: IntervaloDatas;
  linhas: T[];
  resumo: Array<{ rotulo: string; valor: string }>;
}

export interface ColunaRelatorio<T> {
  chave: string;
  titulo: string;
  valor: (linha: T) => string | number;
  html?: (linha: T) => string;
  ordenavel?: boolean;
}
