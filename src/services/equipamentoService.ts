import { Equipamento, CriarEquipamentoDTO, AtualizarEquipamentoDTO } from '../types/equipamento';
import { getStorageItem, setStorageItem, setStorageItems, KEYS } from './storage';
import { generateId } from '../utils/idGenerator';
import { isNotEmpty } from '../utils/validators';

export class EquipamentoService {
  public static getAll(): Equipamento[] {
    const stored = getStorageItem<Array<Equipamento & { patrimonio?: string; setor?: string; usuarioResponsavelId?: string | null }>>(KEYS.EQUIPAMENTOS, []);
    return this.normalizeLegacyItems(stored).items;
  }

  public static migrateLegacyData(): void {
    const stored = getStorageItem<Array<Equipamento & { patrimonio?: string; setor?: string; usuarioResponsavelId?: string | null }>>(KEYS.EQUIPAMENTOS, []);
    if (!stored.length) return;
    const normalized = this.normalizeLegacyItems(stored);
    const currentCounter = getStorageItem<number>(KEYS.CONTADOR_EQUIPAMENTOS, 0);
    if (normalized.changed || currentCounter < normalized.maxCode) {
      setStorageItems([
        [KEYS.CONTADOR_EQUIPAMENTOS, Math.max(currentCounter, normalized.maxCode)],
        [KEYS.EQUIPAMENTOS, normalized.items],
      ]);
    }
  }

  public static getById(id: string): Equipamento | undefined {
    return this.getAll().find((eq) => eq.id === id);
  }

  public static validate(dto: Partial<CriarEquipamentoDTO>, idEdicao?: string, currentStatus?: string): string[] {
    const errors: string[] = [];

    if (isNotEmpty(dto.numeroSerie)) {
      const existingSerie = this.getAll().find(
        (eq) => eq.numeroSerie.trim().toLowerCase() === dto.numeroSerie!.trim().toLowerCase() && eq.id !== idEdicao
      );
      if (existingSerie) {
        errors.push('Já existe um equipamento cadastrado com este número de série.');
      }
    }

    if (!isNotEmpty(dto.tipo)) {
      errors.push('O tipo de equipamento é obrigatório.');
    }

    if (!isNotEmpty(dto.fabricante)) {
      errors.push('O fabricante é obrigatório.');
    }

    if (!isNotEmpty(dto.modelo)) {
      errors.push('O modelo é obrigatório.');
    }

    if (!isNotEmpty(dto.clienteId)) errors.push('O cliente do equipamento é obrigatório.');

    if (!isNotEmpty(dto.dataAquisicao)) {
      errors.push('A data de aquisição é obrigatória.');
    }

    if (currentStatus === 'DESCARTADO' && dto.status === 'EM_USO') {
      errors.push('Equipamento descartado não pode ser colocado diretamente como em uso.');
    }

    return errors;
  }

  public static create(dto: CriarEquipamentoDTO): Equipamento {
    this.migrateLegacyData();
    const errors = this.validate(dto);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const now = new Date().toISOString();
    const list = this.getAll();
    const { codigo, counter } = this.nextCode(list);
    const novoEquipamento: Equipamento = {
      id: generateId('EQP'),
      codigo,
      tipo: dto.tipo,
      fabricante: dto.fabricante.trim(),
      modelo: dto.modelo.trim(),
      numeroSerie: dto.numeroSerie?.trim() ?? '',
      status: dto.status,
      clienteId: dto.clienteId,
      dataAquisicao: dto.dataAquisicao,
      observacoes: dto.observacoes ? dto.observacoes.trim() : '',
      criadoEm: now,
      atualizadoEm: now,
    };

    list.unshift(novoEquipamento);
    // Contador e coleção são persistidos juntos; códigos excluídos nunca são reutilizados.
    setStorageItems([
      [KEYS.CONTADOR_EQUIPAMENTOS, counter],
      [KEYS.EQUIPAMENTOS, list],
    ]);
    return novoEquipamento;
  }

  public static update(id: string, dto: AtualizarEquipamentoDTO): Equipamento {
    const list = this.getAll();
    const index = list.findIndex((eq) => eq.id === id);
    if (index === -1) {
      throw new Error('Equipamento não encontrado.');
    }

    const current = list[index];
    const updatedData = { ...current, ...dto };

    const errors = this.validate(updatedData, id, current.status);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const updatedEquipamento: Equipamento = {
      ...updatedData,
      codigo: current.codigo,
      numeroSerie: updatedData.numeroSerie?.trim() ?? '',
      clienteId: updatedData.clienteId,
      atualizadoEm: new Date().toISOString(),
    };

    list[index] = updatedEquipamento;
    setStorageItem(KEYS.EQUIPAMENTOS, list);
    return updatedEquipamento;
  }

  public static updateStatus(id: string, newStatus: Equipamento['status']): Equipamento {
    return this.update(id, { status: newStatus });
  }

  public static delete(id: string): void {
    const list = this.getAll().filter((eq) => eq.id !== id);
    setStorageItem(KEYS.EQUIPAMENTOS, list);
  }

  private static nextCode(items: Equipamento[]): { codigo: string; counter: number } {
    const used = new Set(items.map((item) => item.codigo));
    const largestExisting = items.reduce((largest, item) => Math.max(largest, this.codeNumber(item.codigo)), 0);
    let counter = Math.max(getStorageItem<number>(KEYS.CONTADOR_EQUIPAMENTOS, 0), largestExisting);
    let codigo = '';
    do {
      counter += 1;
      codigo = this.formatCode(counter);
    } while (used.has(codigo));
    return { codigo, counter };
  }

  private static normalizeLegacyItems(stored: Array<Equipamento & { patrimonio?: string; setor?: string; usuarioResponsavelId?: string | null }>): { items: Equipamento[]; maxCode: number; changed: boolean } {
    const used = new Set<number>();
    let maxCode = 0;
    stored.forEach((item) => {
      const number = this.codeNumber(item.codigo);
      if (number > 0) { used.add(number); maxCode = Math.max(maxCode, number); }
    });

    let changed = false;
    const items = stored.map((item) => {
      let codigo = item.codigo;
      if (this.codeNumber(codigo) === 0) {
        const legacyNumber = Number(item.patrimonio?.match(/(\d+)$/)?.[1] ?? 0);
        let number = legacyNumber > 0 && !used.has(legacyNumber) ? legacyNumber : maxCode + 1;
        while (used.has(number)) number += 1;
        used.add(number);
        maxCode = Math.max(maxCode, number);
        codigo = this.formatCode(number);
        changed = true;
      }
      const normalized = { ...item, codigo, clienteId: item.clienteId ?? item.usuarioResponsavelId ?? '' } as Equipamento & { patrimonio?: string; setor?: string; usuarioResponsavelId?: string | null };
      if ('patrimonio' in normalized) { delete normalized.patrimonio; changed = true; }
      if ('setor' in normalized) { delete normalized.setor; changed = true; }
      if ('usuarioResponsavelId' in normalized) { delete normalized.usuarioResponsavelId; changed = true; }
      return normalized as Equipamento;
    });
    return { items, maxCode, changed };
  }

  private static codeNumber(code: string | undefined): number {
    const match = code?.match(/^TFX-EQP-(\d{6,})$/);
    return match ? Number(match[1]) : 0;
  }

  private static formatCode(number: number): string {
    return `TFX-EQP-${String(number).padStart(6, '0')}`;
  }
}
