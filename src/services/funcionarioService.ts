import { AtualizarFuncionarioDTO, CriarFuncionarioDTO, Funcionario } from '../types/funcionario';
import { Chamado } from '../types/chamado';
import { Manutencao } from '../types/manutencao';
import { generateId } from '../utils/idGenerator';
import { isNotEmpty, isValidEmail } from '../utils/validators';
import { getStorageItem, KEYS, setStorageItem } from './storage';
import { logger } from './logger';

export class FuncionarioService {
  public static getAll(): Funcionario[] { return getStorageItem<Funcionario[]>(KEYS.FUNCIONARIOS, []); }
  public static getById(id: string | null | undefined): Funcionario | undefined { return id ? this.getAll().find((item) => item.id === id) : undefined; }

  public static getAssignable(): Funcionario[] {
    return this.getAll().filter((item) => item.status === 'ATIVO' && ['TECNICO', 'SUPERVISOR', 'ADMINISTRADOR'].includes(item.cargo));
  }

  public static validate(dto: Partial<CriarFuncionarioDTO>, editingId?: string): string[] {
    const errors: string[] = [];
    if (!isNotEmpty(dto.nome)) errors.push('O nome do funcionário é obrigatório.');
    if (!isNotEmpty(dto.email)) errors.push('O email do funcionário é obrigatório.');
    else if (!isValidEmail(dto.email!)) errors.push('O email informado possui formato inválido.');
    else if (this.getAll().some((item) => item.id !== editingId && item.email.toLowerCase() === dto.email!.trim().toLowerCase())) errors.push('Já existe um funcionário cadastrado com este email.');
    if (!dto.cargo) errors.push('O cargo do funcionário é obrigatório.');
    if (!dto.status) errors.push('O status do funcionário é obrigatório.');
    return errors;
  }

  public static create(dto: CriarFuncionarioDTO): Funcionario {
    const errors = this.validate(dto); if (errors.length) throw new Error(errors.join(' '));
    const now = new Date().toISOString();
    const item: Funcionario = { ...dto, id: generateId('FUN'), nome: dto.nome.trim(), email: dto.email.trim().toLowerCase(), telefone: dto.telefone.trim(), especialidades: [...new Set(dto.especialidades)], observacoes: dto.observacoes.trim(), criadoEm: now, atualizadoEm: now };
    setStorageItem(KEYS.FUNCIONARIOS, [item, ...this.getAll()]);
    logger.info('Funcionário cadastrado.', { funcionarioId: item.id, cargo: item.cargo });
    return item;
  }

  public static update(id: string, dto: AtualizarFuncionarioDTO): Funcionario {
    const list = this.getAll(); const index = list.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Funcionário não encontrado.');
    const merged = { ...list[index], ...dto };
    const errors = this.validate(merged, id); if (errors.length) throw new Error(errors.join(' '));
    const updated: Funcionario = { ...merged, nome: merged.nome.trim(), email: merged.email.trim().toLowerCase(), telefone: merged.telefone.trim(), especialidades: [...new Set(merged.especialidades)], observacoes: merged.observacoes.trim(), atualizadoEm: new Date().toISOString() };
    list[index] = updated; setStorageItem(KEYS.FUNCIONARIOS, list);
    logger.info('Funcionário atualizado.', { funcionarioId: id, cargo: updated.cargo });
    return updated;
  }

  public static setActive(id: string, active: boolean): Funcionario {
    const updated = this.update(id, { status: active ? 'ATIVO' : 'INATIVO' });
    logger.info(active ? 'Funcionário ativado.' : 'Funcionário inativado.', { funcionarioId: id });
    return updated;
  }

  public static getLinkCounts(id: string): { ordens: number; reparos: number; total: number } {
    const ordens = getStorageItem<Chamado[]>(KEYS.CHAMADOS, []).filter((item) => item.tecnicoResponsavelId === id).length;
    const reparos = getStorageItem<Manutencao[]>(KEYS.MANUTENCOES, []).filter((item) => item.tecnicoResponsavelId === id).length;
    return { ordens, reparos, total: ordens + reparos };
  }

  public static delete(id: string): void {
    const links = this.getLinkCounts(id);
    if (links.total) throw new Error('Este funcionário possui registros vinculados e não pode ser excluído definitivamente. Você pode inativá-lo para impedir novas atribuições.');
    setStorageItem(KEYS.FUNCIONARIOS, this.getAll().filter((item) => item.id !== id));
    logger.info('Funcionário excluído.', { funcionarioId: id });
  }

  public static resolveName(id: string | null | undefined, legacyName?: string): string {
    return this.getById(id)?.nome ?? legacyName ?? 'Não atribuído';
  }
}
