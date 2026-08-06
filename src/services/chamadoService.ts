import { Chamado, CriarChamadoDTO, AtualizarChamadoDTO, StatusChamado } from '../types/chamado';
import { getStorageItem, setStorageItem, KEYS } from './storage';
import { UsuarioService } from './usuarioService';
import { EquipamentoService } from './equipamentoService';
import { FuncionarioService } from './funcionarioService';
import { generateId } from '../utils/idGenerator';
import { isNotEmpty } from '../utils/validators';
import { logger } from './logger';

type LegacyChamado = Chamado & { solicitanteId?: string; setor?: string; tecnicoResponsavel?: string };

export class ChamadoService {
  public static getAll(): Chamado[] {
    return getStorageItem<LegacyChamado[]>(KEYS.CHAMADOS, []).map((item) => this.normalize(item));
  }

  public static migrateLegacyData(): void {
    const stored = getStorageItem<LegacyChamado[]>(KEYS.CHAMADOS, []);
    if (stored.some((item) => 'setor' in item || 'solicitanteId' in item || 'tecnicoResponsavel' in item)) setStorageItem(KEYS.CHAMADOS, stored.map((item) => this.normalize(item)));
  }

  public static getById(id: string): Chamado | undefined { return this.getAll().find((item) => item.id === id); }

  public static validate(dto: Partial<CriarChamadoDTO>, currentTechnicianId: string | null = null): string[] {
    const errors: string[] = [];
    if (!isNotEmpty(dto.titulo)) errors.push('O título da ordem é obrigatório.');
    if (!isNotEmpty(dto.descricao)) errors.push('A descrição da ordem é obrigatória.');
    if (!isNotEmpty(dto.clienteId)) errors.push('O cliente da ordem é obrigatório.');
    else if (!UsuarioService.getById(dto.clienteId!)) errors.push('O cliente selecionado não existe.');
    if (!isNotEmpty(dto.equipamentoId)) errors.push('O equipamento da ordem é obrigatório.');
    else {
      const equipment = EquipamentoService.getById(dto.equipamentoId!);
      if (!equipment) errors.push('O equipamento selecionado não existe.');
      else if (equipment.clienteId !== dto.clienteId) errors.push('O equipamento selecionado não pertence ao cliente informado.');
    }
    if (!dto.prioridade) errors.push('A prioridade da ordem é obrigatória.');
    if (dto.tecnicoResponsavelId && dto.tecnicoResponsavelId !== currentTechnicianId && !FuncionarioService.getAssignable().some((item) => item.id === dto.tecnicoResponsavelId)) errors.push('O técnico selecionado não está ativo ou não pode receber serviços.');
    return errors;
  }

  public static create(dto: CriarChamadoDTO): Chamado {
    const errors = this.validate(dto); if (errors.length) throw new Error(errors.join(' '));
    const now = new Date().toISOString();
    const item: Chamado = { ...dto, id: generateId('CHD'), titulo: dto.titulo.trim(), descricao: dto.descricao.trim(), status: dto.status || 'ABERTO', tecnicoResponsavelId: dto.tecnicoResponsavelId || null, criadoEm: now, atualizadoEm: now, concluidoEm: dto.status === 'CONCLUIDO' ? now : null };
    setStorageItem(KEYS.CHAMADOS, [item, ...this.getAll()]);
    logger.info('Ordem de serviço cadastrada.', { ordemId: item.id, clienteId: item.clienteId, equipamentoId: item.equipamentoId, tecnicoResponsavelId: item.tecnicoResponsavelId });
    return item;
  }

  public static update(id: string, dto: AtualizarChamadoDTO): Chamado {
    const list = this.getAll(); const index = list.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Ordem de serviço não encontrada.');
    const current = list[index]; const merged = { ...current, ...dto };
    const errors = this.validate(merged, current.tecnicoResponsavelId); if (errors.length) throw new Error(errors.join(' '));
    const now = new Date().toISOString();
    const updated: Chamado = { ...merged, titulo: merged.titulo.trim(), descricao: merged.descricao.trim(), tecnicoResponsavelId: merged.tecnicoResponsavelId || null, concluidoEm: merged.status === 'CONCLUIDO' ? current.concluidoEm ?? now : null, atualizadoEm: now };
    list[index] = updated; setStorageItem(KEYS.CHAMADOS, list);
    if (current.tecnicoResponsavelId !== updated.tecnicoResponsavelId) logger.info(updated.tecnicoResponsavelId ? 'Técnico atribuído à ordem.' : 'Técnico removido da ordem.', { ordemId: id, tecnicoResponsavelId: updated.tecnicoResponsavelId });
    return updated;
  }

  public static updateStatus(id: string, status: StatusChamado): Chamado { return this.update(id, { status }); }
  public static delete(id: string): void { setStorageItem(KEYS.CHAMADOS, this.getAll().filter((item) => item.id !== id)); }

  private static normalize(item: LegacyChamado): Chamado {
    const normalized = { ...item, clienteId: item.clienteId ?? item.solicitanteId ?? '', equipamentoId: item.equipamentoId ?? '', tecnicoResponsavelId: item.tecnicoResponsavelId ?? null, tecnicoResponsavelNomeLegado: item.tecnicoResponsavelNomeLegado ?? item.tecnicoResponsavel } as LegacyChamado;
    delete normalized.solicitanteId; delete normalized.setor; delete normalized.tecnicoResponsavel;
    return normalized;
  }
}
