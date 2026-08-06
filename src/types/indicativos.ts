import { PrioridadeChamado, StatusChamado } from './chamado';
import { TipoEquipamento } from './equipamento';
import { StatusManutencao } from './manutencao';

export type PeriodoRapido =
  | 'HOJE' | 'ONTEM' | 'ULTIMOS_7_DIAS' | 'ULTIMOS_30_DIAS' | 'ULTIMOS_90_DIAS'
  | 'ESTE_MES' | 'MES_ANTERIOR' | 'ESTE_ANO' | 'ANO_ANTERIOR' | 'PERSONALIZADO';
export type AgrupamentoTemporal = 'DIA' | 'SEMANA' | 'MES' | 'ANO';
export type OrdenacaoTecnico = 'CONCLUIDAS' | 'TAXA' | 'TEMPO' | 'VALOR';

export interface IntervaloDatas { inicio: Date; fim: Date }

export interface FiltrosIndicativos {
  periodo: PeriodoRapido;
  dataInicial: string;
  dataFinal: string;
  agrupamento: AgrupamentoTemporal;
  statusChamado: StatusChamado | '';
  prioridade: PrioridadeChamado | '';
  tecnico: string;
  tipoEquipamento: TipoEquipamento | '';
  clienteId: string;
  statusManutencao: StatusManutencao | '';
  ordenacaoTecnico: OrdenacaoTecnico;
}

export interface ComparacaoIndicador {
  percentual: number | null;
  melhorou: boolean | null;
}

export interface IndicadorPrincipal {
  chave: string;
  titulo: string;
  valor: string;
  descricao: string;
  icone: string;
  variante: 'info' | 'success' | 'warning' | 'danger' | 'accent';
  comparacao: ComparacaoIndicador;
}

export interface PontoTemporal {
  chave: string;
  rotulo: string;
  abertas: number;
  concluidas: number;
  valor: number;
  tempoMedioHoras: number | null;
}

export interface Distribuicao { chave: string; rotulo: string; quantidade: number }

export interface DesempenhoTecnico {
  nome: string;
  atribuidas: number;
  concluidas: number;
  emAndamento: number;
  taxaConclusao: number;
  tempoMedioHoras: number | null;
  valorServicos: number;
}

export interface RankingCliente {
  id: string;
  nome: string;
  ordens: number;
  ultimaOrdem: string;
}

export interface RetornoEquipamento {
  id: string;
  identificacao: string;
  cliente: string;
  reparos: number;
  ultimaEntrada: string;
  status: string;
}

export interface DestaqueRanking { titulo: string; valor: string; detalhe: string; icone: string }
