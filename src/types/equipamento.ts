export type TipoEquipamento =
  | 'NOTEBOOK'
  | 'DESKTOP'
  | 'MONITOR'
  | 'IMPRESSORA'
  | 'CELULAR'
  | 'OUTRO';

export type StatusEquipamento =
  | 'DISPONIVEL'
  | 'EM_USO'
  | 'EM_MANUTENCAO'
  | 'DESCARTADO';

export interface Equipamento {
  id: string;
  codigo: string;
  tipo: TipoEquipamento;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  status: StatusEquipamento;
  clienteId: string;
  dataAquisicao: string;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type CriarEquipamentoDTO = Omit<Equipamento, 'id' | 'codigo' | 'criadoEm' | 'atualizadoEm'>;
export type AtualizarEquipamentoDTO = Partial<CriarEquipamentoDTO>;
