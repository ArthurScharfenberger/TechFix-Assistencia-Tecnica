import { Chamado } from '../types/chamado';
import { Equipamento } from '../types/equipamento';
import { Manutencao } from '../types/manutencao';
import {
  ComparacaoIndicador, DesempenhoTecnico, DestaqueRanking, Distribuicao, FiltrosIndicativos,
  IndicadorPrincipal, IntervaloDatas, PontoTemporal, RankingCliente, RetornoEquipamento,
} from '../types/indicativos';
import { ChamadoService } from './chamadoService';
import { EquipamentoService } from './equipamentoService';
import { ManutencaoService } from './manutencaoService';
import { UsuarioService } from './usuarioService';
import { FuncionarioService } from './funcionarioService';
import {
  durationHours, formatDuration, formatGroupLabel, getGroupKey, getIntervalo,
  getIntervaloAnterior, isInInterval,
} from '../utils/dateGrouping';
import { formatCurrency } from '../utils/formatters';

interface Snapshot {
  abertas: number; concluidas: number; canceladas: number; urgentes: number; valor: number;
  servicosComValor: number; tempoMedio: number | null; equipamentos: number; clientes: number;
}

export interface ResultadoIndicativos {
  intervalo: IntervaloDatas;
  intervaloAnterior: IntervaloDatas;
  indicadores: IndicadorPrincipal[];
  serieTemporal: PontoTemporal[];
  status: Distribuicao[];
  prioridades: Distribuicao[];
  tiposEquipamento: Distribuicao[];
  tecnicos: DesempenhoTecnico[];
  clientes: RankingCliente[];
  retornos: RetornoEquipamento[];
  rankings: DestaqueRanking[];
  eficiencia: Array<{ titulo: string; valor: string; destaque?: 'success' | 'warning' | 'danger' }>;
  ordensFiltradas: Chamado[];
  reparosFiltrados: Manutencao[];
  totalRegistros: number;
}

const statusLabels: Record<string, string> = {
  ABERTO: 'Aberta', EM_ATENDIMENTO: 'Em atendimento', AGUARDANDO_USUARIO: 'Aguardando cliente',
  CONCLUIDO: 'Concluída', CANCELADO: 'Cancelada',
};
const prioridadeLabels: Record<string, string> = { BAIXA: 'Baixa', NORMAL: 'Normal', ALTA: 'Alta', URGENTE: 'Urgente' };
const tipoLabels: Record<string, string> = { NOTEBOOK: 'Notebook', DESKTOP: 'Desktop', MONITOR: 'Monitor', IMPRESSORA: 'Impressora', CELULAR: 'Celular', OUTRO: 'Outro' };

function average(values: number[]): number | null {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function compare(current: number | null, previous: number | null, lowerIsBetter = false): ComparacaoIndicador {
  if (current === null || previous === null || previous === 0 || !Number.isFinite(current) || !Number.isFinite(previous)) {
    return { percentual: null, melhorou: null };
  }
  const percentual = ((current - previous) / Math.abs(previous)) * 100;
  return { percentual, melhorou: percentual === 0 ? null : lowerIsBetter ? percentual < 0 : percentual > 0 };
}

function countBy<T>(items: T[], key: (item: T) => string | undefined): Map<string, number> {
  const result = new Map<string, number>();
  items.forEach((item) => { const value = key(item); if (value) result.set(value, (result.get(value) ?? 0) + 1); });
  return result;
}

export class IndicativosService {
  public static analyze(filters: FiltrosIndicativos): ResultadoIndicativos {
    // Uma leitura por entidade evita releituras repetidas do LocalStorage durante os cálculos.
    const allOrders = ChamadoService.getAll();
    const allRepairs = ManutencaoService.getAll();
    const equipments = EquipamentoService.getAll();
    const users = UsuarioService.getAll();
    const equipmentMap = new Map(equipments.map((item) => [item.id, item]));
    const userMap = new Map(users.map((item) => [item.id, item]));
    const intervalo = getIntervalo(filters.periodo, filters.dataInicial, filters.dataFinal);
    const intervaloAnterior = getIntervaloAnterior(intervalo, filters.periodo);

    const orderDimension = (item: Chamado): boolean =>
      (!filters.statusChamado || item.status === filters.statusChamado)
      && (!filters.prioridade || item.prioridade === filters.prioridade)
      && (!filters.tecnico || item.tecnicoResponsavelId === filters.tecnico)
      && (!filters.clienteId || item.clienteId === filters.clienteId);
    const repairDimension = (item: Manutencao): boolean => {
      const equipment = equipmentMap.get(item.equipamentoId);
      return (!filters.statusManutencao || item.status === filters.statusManutencao)
        && (!filters.tecnico || item.tecnicoResponsavelId === filters.tecnico)
        && (!filters.tipoEquipamento || equipment?.tipo === filters.tipoEquipamento)
        && (!filters.clienteId || equipment?.clienteId === filters.clienteId);
    };

    const ordersByDimension = allOrders.filter(orderDimension);
    const repairsByDimension = allRepairs.filter(repairDimension);
    const current = this.snapshot(ordersByDimension, repairsByDimension, intervalo);
    const previous = this.snapshot(ordersByDimension, repairsByDimension, intervaloAnterior);
    // Aberturas usam criadoEm; conclusões e valores usam suas respectivas datas de conclusão.
    const createdOrders = ordersByDimension.filter((item) => isInInterval(item.criadoEm, intervalo));
    const completedOrders = ordersByDimension.filter((item) => item.status === 'CONCLUIDO' && isInInterval(item.concluidoEm, intervalo));
    const repairsInPeriod = repairsByDimension.filter((item) => isInInterval(item.dataInicio, intervalo));
    const completedRepairs = repairsByDimension.filter((item) => item.status === 'CONCLUIDA' && isInInterval(item.dataConclusao, intervalo));

    const indicadores: IndicadorPrincipal[] = [
      this.card('abertas', 'Ordens abertas no período', String(current.abertas), 'Ordens criadas no período', 'inbox', 'info', compare(current.abertas, previous.abertas)),
      this.card('concluidas', 'Ordens concluídas', String(current.concluidas), 'Conclusões registradas no período', 'circle-check', 'success', compare(current.concluidas, previous.concluidas)),
      this.card('taxa', 'Taxa de conclusão', `${current.abertas ? ((current.concluidas / current.abertas) * 100).toFixed(1) : '0,0'}%`, 'Concluídas ÷ criadas no período', 'line-chart', 'success', compare(current.abertas ? current.concluidas / current.abertas : 0, previous.abertas ? previous.concluidas / previous.abertas : null)),
      this.card('tempo', 'Tempo médio de resolução', formatDuration(current.tempoMedio), 'Entre abertura e conclusão', 'timer', 'accent', compare(current.tempoMedio, previous.tempoMedio, true)),
      this.card('urgentes', 'Ordens urgentes', String(current.urgentes), 'Criadas no período selecionado', 'siren', current.urgentes ? 'danger' : 'success', compare(current.urgentes, previous.urgentes, true)),
      this.card('canceladas', 'Ordens canceladas', String(current.canceladas), 'Canceladas entre as ordens criadas', 'circle-x', current.canceladas ? 'warning' : 'success', compare(current.canceladas, previous.canceladas, true)),
      this.card('valor', 'Valor dos serviços', formatCurrency(current.valor), 'Reparos concluídos no período', 'dollar-sign', 'success', compare(current.valor, previous.valor)),
      this.card('ticket', 'Valor médio por serviço', current.servicosComValor ? formatCurrency(current.valor / current.servicosComValor) : 'Sem dados', 'Somente reparos concluídos com valor', 'receipt', 'accent', compare(current.servicosComValor ? current.valor / current.servicosComValor : null, previous.servicosComValor ? previous.valor / previous.servicosComValor : null)),
      this.card('equipamentos', 'Equipamentos atendidos', String(current.equipamentos), 'Equipamentos distintos em reparos', 'laptop', 'info', compare(current.equipamentos, previous.equipamentos)),
      this.card('clientes', 'Clientes atendidos', String(current.clientes), 'Clientes distintos com novas ordens', 'users', 'info', compare(current.clientes, previous.clientes)),
    ];

    const resolutionHours = completedOrders.map((item) => durationHours(item.criadoEm, item.concluidoEm)).filter((value): value is number => value !== null);
    const openCurrent = ordersByDimension.filter((item) => !['CONCLUIDO', 'CANCELADO'].includes(item.status));
    const eficiencia = [
      { titulo: 'Maior tempo de resolução', valor: formatDuration(resolutionHours.length ? Math.max(...resolutionHours) : null), destaque: 'warning' as const },
      { titulo: 'Menor tempo de resolução', valor: formatDuration(resolutionHours.length ? Math.min(...resolutionHours) : null), destaque: 'success' as const },
      { titulo: 'Taxa de cancelamento', valor: `${createdOrders.length ? ((current.canceladas / createdOrders.length) * 100).toFixed(1) : '0,0'}%` },
      { titulo: 'Atualmente em atendimento', valor: String(openCurrent.filter((item) => item.status === 'EM_ATENDIMENTO').length), destaque: 'warning' as const },
      { titulo: 'Aguardando cliente', valor: String(openCurrent.filter((item) => item.status === 'AGUARDANDO_USUARIO').length), destaque: 'warning' as const },
      { titulo: 'Urgentes ainda abertas', valor: String(openCurrent.filter((item) => item.prioridade === 'URGENTE').length), destaque: 'danger' as const },
      { titulo: 'Equipamentos em reparo', valor: String(equipments.filter((item) => item.status === 'EM_MANUTENCAO').length), destaque: 'warning' as const },
    ];

    const tecnicos = this.technicians(createdOrders, completedOrders, completedRepairs, filters.ordenacaoTecnico);
    const clientes = this.clients(createdOrders, userMap);
    const retornos = this.returns(repairsInPeriod, equipmentMap, userMap);
    const rankings = this.rankings(createdOrders, completedOrders, completedRepairs, tecnicos, clientes, equipmentMap);

    return {
      intervalo, intervaloAnterior, indicadores,
      serieTemporal: this.timeSeries(createdOrders, completedOrders, completedRepairs, filters.agrupamento),
      status: this.distribution(createdOrders, (item) => item.status, statusLabels),
      prioridades: this.distribution(createdOrders, (item) => item.prioridade, prioridadeLabels),
      tiposEquipamento: this.distribution(repairsInPeriod, (item) => equipmentMap.get(item.equipamentoId)?.tipo ?? 'OUTRO', tipoLabels),
      tecnicos, clientes, retornos, rankings, eficiencia,
      ordensFiltradas: createdOrders,
      reparosFiltrados: completedRepairs,
      totalRegistros: new Set([...createdOrders, ...completedOrders].map((item) => item.id)).size
        + new Set([...repairsInPeriod, ...completedRepairs].map((item) => item.id)).size,
    };
  }

  private static snapshot(orders: Chamado[], repairs: Manutencao[], range: IntervaloDatas): Snapshot {
    const created = orders.filter((item) => isInInterval(item.criadoEm, range));
    const completed = orders.filter((item) => item.status === 'CONCLUIDO' && isInInterval(item.concluidoEm, range));
    const completedRepairs = repairs.filter((item) => item.status === 'CONCLUIDA' && isInInterval(item.dataConclusao, range));
    const validValues = completedRepairs.filter((item) => Number.isFinite(item.custo) && item.custo >= 0);
    return {
      abertas: created.length,
      concluidas: completed.length,
      canceladas: created.filter((item) => item.status === 'CANCELADO').length,
      urgentes: created.filter((item) => item.prioridade === 'URGENTE').length,
      valor: validValues.reduce((sum, item) => sum + item.custo, 0),
      servicosComValor: validValues.length,
      tempoMedio: average(completed.map((item) => durationHours(item.criadoEm, item.concluidoEm)).filter((value): value is number => value !== null)),
      equipamentos: new Set(repairs.filter((item) => isInInterval(item.dataInicio, range)).map((item) => item.equipamentoId)).size,
      clientes: new Set(created.map((item) => item.clienteId)).size,
    };
  }

  private static card(chave: string, titulo: string, valor: string, descricao: string, icone: string, variante: IndicadorPrincipal['variante'], comparacao: ComparacaoIndicador): IndicadorPrincipal {
    return { chave, titulo, valor, descricao, icone, variante, comparacao };
  }

  private static distribution<T>(items: T[], getKey: (item: T) => string, labels: Record<string, string>): Distribuicao[] {
    return [...countBy(items, getKey)].map(([chave, quantidade]) => ({ chave, rotulo: labels[chave] ?? chave, quantidade })).sort((a, b) => b.quantidade - a.quantidade);
  }

  private static timeSeries(opened: Chamado[], completed: Chamado[], repairs: Manutencao[], grouping: FiltrosIndicativos['agrupamento']): PontoTemporal[] {
    const points = new Map<string, PontoTemporal>();
    const ensure = (date: string): PontoTemporal | null => {
      const key = getGroupKey(date, grouping); if (!key) return null;
      if (!points.has(key)) points.set(key, { chave: key, rotulo: formatGroupLabel(key, grouping), abertas: 0, concluidas: 0, valor: 0, tempoMedioHoras: null });
      return points.get(key)!;
    };
    opened.forEach((item) => { const point = ensure(item.criadoEm); if (point) point.abertas += 1; });
    const resolutionByKey = new Map<string, number[]>();
    completed.forEach((item) => {
      if (!item.concluidoEm) return; const point = ensure(item.concluidoEm); if (!point) return;
      point.concluidas += 1; const duration = durationHours(item.criadoEm, item.concluidoEm);
      if (duration !== null) { const key = point.chave; resolutionByKey.set(key, [...(resolutionByKey.get(key) ?? []), duration]); }
    });
    repairs.forEach((item) => { if (!item.dataConclusao) return; const point = ensure(item.dataConclusao); if (point && Number.isFinite(item.custo) && item.custo >= 0) point.valor += item.custo; });
    resolutionByKey.forEach((values, key) => { const point = points.get(key); if (point) point.tempoMedioHoras = average(values); });
    return [...points.values()].sort((a, b) => a.chave.localeCompare(b.chave));
  }

  private static technicians(created: Chamado[], completed: Chamado[], repairs: Manutencao[], sort: FiltrosIndicativos['ordenacaoTecnico']): DesempenhoTecnico[] {
    const key = (item: Chamado | Manutencao) => item.tecnicoResponsavelId ?? `legacy:${item.tecnicoResponsavelNomeLegado ?? 'Não atribuído'}`;
    const keys = new Set([...created.map(key), ...repairs.map(key)]);
    const rows = [...keys].map((technicianKey) => {
      const assigned = created.filter((item) => key(item) === technicianKey);
      const done = completed.filter((item) => key(item) === technicianKey);
      const repairValues = repairs.filter((item) => key(item) === technicianKey);
      const sample = assigned[0] ?? repairValues[0];
      const nome = FuncionarioService.resolveName(sample?.tecnicoResponsavelId ?? null, sample?.tecnicoResponsavelNomeLegado);
      return { nome, atribuidas: assigned.length, concluidas: done.length, emAndamento: assigned.filter((item) => !['CONCLUIDO', 'CANCELADO'].includes(item.status)).length, taxaConclusao: assigned.length ? (done.length / assigned.length) * 100 : 0, tempoMedioHoras: average(done.map((item) => durationHours(item.criadoEm, item.concluidoEm)).filter((value): value is number => value !== null)), valorServicos: repairValues.reduce((sum, item) => sum + (Number.isFinite(item.custo) ? item.custo : 0), 0) };
    });
    const selector = (item: DesempenhoTecnico): number => sort === 'TAXA' ? item.taxaConclusao : sort === 'TEMPO' ? -(item.tempoMedioHoras ?? Number.MAX_SAFE_INTEGER) : sort === 'VALOR' ? item.valorServicos : item.concluidas;
    return rows.sort((a, b) => selector(b) - selector(a));
  }

  private static clients(orders: Chamado[], users: Map<string, ReturnType<typeof UsuarioService.getAll>[number]>): RankingCliente[] {
    const counts = countBy(orders, (item) => item.clienteId);
    return [...counts].map(([id, ordens]) => ({ id, nome: users.get(id)?.nome ?? 'Cliente removido', ordens, ultimaOrdem: orders.filter((item) => item.clienteId === id).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))[0]?.criadoEm ?? '' })).sort((a, b) => b.ordens - a.ordens).slice(0, 10);
  }

  private static returns(repairs: Manutencao[], equipments: Map<string, Equipamento>, users: Map<string, ReturnType<typeof UsuarioService.getAll>[number]>): RetornoEquipamento[] {
    const counts = countBy(repairs, (item) => item.equipamentoId);
    return [...counts].filter(([, amount]) => amount > 1).map(([id, reparos]) => {
      const equipment = equipments.get(id); const latest = repairs.filter((item) => item.equipamentoId === id).sort((a, b) => b.dataInicio.localeCompare(a.dataInicio))[0];
      return { id, identificacao: equipment ? `${equipment.fabricante} ${equipment.modelo} · ${equipment.codigo}` : 'Equipamento removido', cliente: equipment?.clienteId ? users.get(equipment.clienteId)?.nome ?? 'Cliente removido' : 'Cliente removido', reparos, ultimaEntrada: latest?.dataInicio ?? '', status: equipment?.status ?? 'REMOVIDO' };
    }).sort((a, b) => b.reparos - a.reparos);
  }

  private static rankings(orders: Chamado[], completed: Chamado[], repairs: Manutencao[], technicians: DesempenhoTecnico[], clients: RankingCliente[], equipments: Map<string, Equipamento>): DestaqueRanking[] {
    const result: DestaqueRanking[] = [];
    const topClient = clients[0]; if (topClient) result.push({ titulo: 'Cliente com mais ordens', valor: topClient.nome, detalhe: `${topClient.ordens} atendimento(s)`, icone: 'crown' });
    const topTech = [...technicians].sort((a, b) => b.concluidas - a.concluidas)[0]; if (topTech?.concluidas) result.push({ titulo: 'Técnico com mais conclusões', valor: topTech.nome, detalhe: `${topTech.concluidas} concluída(s)`, icone: 'award' });
    const largest = [...repairs].sort((a, b) => b.custo - a.custo)[0]; if (largest) result.push({ titulo: 'Maior serviço realizado', valor: formatCurrency(largest.custo), detalhe: equipments.get(largest.equipamentoId)?.modelo ?? 'Equipamento removido', icone: 'dollar-sign' });
    const longest = [...completed].map((item) => ({ item, hours: durationHours(item.criadoEm, item.concluidoEm) })).filter((entry): entry is { item: Chamado; hours: number } => entry.hours !== null).sort((a, b) => b.hours - a.hours)[0];
    if (longest) result.push({ titulo: 'Maior tempo de resolução', valor: formatDuration(longest.hours), detalhe: longest.item.titulo, icone: 'hourglass' });
    if (orders.length) { const priorities = countBy(orders, (item) => item.prioridade); const top = [...priorities].sort((a, b) => b[1] - a[1])[0]; result.push({ titulo: 'Prioridade mais frequente', valor: prioridadeLabels[top[0]] ?? top[0], detalhe: `${top[1]} ordem(ns)`, icone: 'list-filter' }); }
    return result;
  }
}
