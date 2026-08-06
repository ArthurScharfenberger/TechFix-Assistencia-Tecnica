import { Manutencao, CriarManutencaoDTO, AtualizarManutencaoDTO, StatusManutencao } from '../types/manutencao';
import { getStorageItem, setStorageItem, KEYS } from './storage';
import { EquipamentoService } from './equipamentoService';
import { FuncionarioService } from './funcionarioService';
import { generateId } from '../utils/idGenerator';
import { isNotEmpty, isNonNegativeNumber } from '../utils/validators';
import { logger } from './logger';

type LegacyRepair = Manutencao & { tecnicoResponsavel?: string };

export class ManutencaoService {
  public static getAll(): Manutencao[] { return getStorageItem<LegacyRepair[]>(KEYS.MANUTENCOES, []).map((item) => this.normalize(item)); }
  public static migrateLegacyData(): void { const stored = getStorageItem<LegacyRepair[]>(KEYS.MANUTENCOES, []); if (stored.some((item) => 'tecnicoResponsavel' in item)) setStorageItem(KEYS.MANUTENCOES, stored.map((item) => this.normalize(item))); }
  public static getById(id: string): Manutencao | undefined { return this.getAll().find((item) => item.id === id); }
  public static getByEquipamento(equipamentoId: string): Manutencao[] { return this.getAll().filter((item) => item.equipamentoId === equipamentoId); }

  public static validate(dto: Partial<CriarManutencaoDTO>, currentTechnicianId: string | null = null): string[] {
    const errors: string[] = [];
    if (!isNotEmpty(dto.equipamentoId)) errors.push('O equipamento é obrigatório.');
    else { const equipment = EquipamentoService.getById(dto.equipamentoId!); if (!equipment) errors.push('O equipamento selecionado não foi encontrado.'); else if (equipment.status === 'DESCARTADO') errors.push('Um equipamento descartado não pode entrar em reparo.'); }
    if (!isNotEmpty(dto.descricao)) errors.push('A descrição do reparo é obrigatória.');
    if (dto.tecnicoResponsavelId && dto.tecnicoResponsavelId !== currentTechnicianId && !FuncionarioService.getAssignable().some((item) => item.id === dto.tecnicoResponsavelId)) errors.push('O técnico selecionado não está ativo ou não pode receber serviços.');
    if (dto.custo === undefined || dto.custo === null || Number.isNaN(dto.custo)) errors.push('O custo é obrigatório.'); else if (!isNonNegativeNumber(dto.custo)) errors.push('O custo não pode ser negativo.');
    if (!isNotEmpty(dto.dataInicio)) errors.push('A data de início é obrigatória.');
    return errors;
  }

  public static create(dto: CriarManutencaoDTO): Manutencao {
    const errors = this.validate(dto); if (errors.length) throw new Error(errors.join(' '));
    const now = new Date().toISOString(); const completed = dto.status === 'CONCLUIDA';
    const item: Manutencao = { ...dto, id: generateId('MNT'), descricao: dto.descricao.trim(), tecnicoResponsavelId: dto.tecnicoResponsavelId || null, custo: Number(dto.custo), status: dto.status || 'AGENDADA', dataConclusao: completed ? now.slice(0, 10) : null, criadoEm: now, atualizadoEm: now };
    setStorageItem(KEYS.MANUTENCOES, [item, ...this.getAll()]); this.syncEquipamentoStatus(item.equipamentoId, item.status);
    logger.info('Reparo cadastrado.', { reparoId: item.id, equipamentoId: item.equipamentoId, tecnicoResponsavelId: item.tecnicoResponsavelId });
    return item;
  }

  public static update(id: string, dto: AtualizarManutencaoDTO): Manutencao {
    const list = this.getAll(); const index = list.findIndex((item) => item.id === id); if (index < 0) throw new Error('Reparo não encontrado.');
    const current = list[index]; const merged = { ...current, ...dto }; const errors = this.validate(merged, current.tecnicoResponsavelId); if (errors.length) throw new Error(errors.join(' '));
    const updated: Manutencao = { ...merged, descricao: merged.descricao.trim(), tecnicoResponsavelId: merged.tecnicoResponsavelId || null, custo: Number(merged.custo), dataConclusao: merged.status === 'CONCLUIDA' ? current.dataConclusao ?? new Date().toISOString().slice(0, 10) : null, atualizadoEm: new Date().toISOString() };
    list[index] = updated; setStorageItem(KEYS.MANUTENCOES, list); this.syncEquipamentoStatus(updated.equipamentoId, updated.status);
    if (current.tecnicoResponsavelId !== updated.tecnicoResponsavelId) logger.info(updated.tecnicoResponsavelId ? 'Técnico atribuído ao reparo.' : 'Técnico removido do reparo.', { reparoId: id, tecnicoResponsavelId: updated.tecnicoResponsavelId });
    return updated;
  }

  public static concluir(id: string): Manutencao { return this.update(id, { status: 'CONCLUIDA', dataConclusao: new Date().toISOString().slice(0, 10) }); }
  public static delete(id: string): void { setStorageItem(KEYS.MANUTENCOES, this.getAll().filter((item) => item.id !== id)); }
  public static getCustoTotal(): number { return this.getAll().reduce((sum, item) => sum + (item.custo || 0), 0); }

  private static syncEquipamentoStatus(id: string, status: StatusManutencao): void { const equipment = EquipamentoService.getById(id); if (!equipment) return; if (status === 'EM_ANDAMENTO') EquipamentoService.updateStatus(id, 'EM_MANUTENCAO'); else if (status === 'CONCLUIDA') EquipamentoService.updateStatus(id, 'DISPONIVEL'); }
  private static normalize(item: LegacyRepair): Manutencao { const normalized = { ...item, tecnicoResponsavelId: item.tecnicoResponsavelId ?? null, tecnicoResponsavelNomeLegado: item.tecnicoResponsavelNomeLegado ?? item.tecnicoResponsavel } as LegacyRepair; delete normalized.tecnicoResponsavel; return normalized; }
}
