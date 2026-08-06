import { Usuario, CriarUsuarioDTO, AtualizarUsuarioDTO } from '../types/usuario';
import { Equipamento } from '../types/equipamento';
import { getStorageItem, setStorageItem, KEYS } from './storage';
import { generateId } from '../utils/idGenerator';
import { isValidEmail, isNotEmpty } from '../utils/validators';

export class UsuarioService {
  public static getAll(): Usuario[] {
    const stored = getStorageItem<Array<Usuario & { setor?: string }>>(KEYS.USUARIOS, []);
    return stored.map((item) => {
      const normalized = { ...item } as Usuario & { setor?: string };
      delete normalized.setor;
      return normalized;
    });
  }

  public static migrateLegacyData(): void {
    const stored = getStorageItem<Array<Usuario & { setor?: string }>>(KEYS.USUARIOS, []);
    if (stored.some((item) => 'setor' in item)) setStorageItem(KEYS.USUARIOS, this.getAll());
  }

  public static getById(id: string): Usuario | undefined {
    return this.getAll().find((u) => u.id === id);
  }

  public static getEquipamentosAssociados(usuarioId: string): Equipamento[] {
    const equipamentos = getStorageItem<Equipamento[]>(KEYS.EQUIPAMENTOS, []);
    return equipamentos.filter((eq) => eq.clienteId === usuarioId);
  }

  public static validate(dto: Partial<CriarUsuarioDTO>, idEdicao?: string): string[] {
    const errors: string[] = [];

    if (!isNotEmpty(dto.nome)) {
      errors.push('O nome do usuário é obrigatório.');
    }

    if (!isNotEmpty(dto.email)) {
      errors.push('O e-mail do usuário é obrigatório.');
    } else if (!isValidEmail(dto.email!)) {
      errors.push('O e-mail informado possui um formato inválido.');
    } else {
      const existing = this.getAll().find(
        (u) => u.email.toLowerCase() === dto.email!.trim().toLowerCase() && u.id !== idEdicao
      );
      if (existing) {
        errors.push('Já existe um usuário cadastrado com este e-mail.');
      }
    }

    if (!isNotEmpty(dto.cargo)) {
      errors.push('O cargo do usuário é obrigatório.');
    }

    return errors;
  }

  public static create(dto: CriarUsuarioDTO): Usuario {
    const errors = this.validate(dto);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const now = new Date().toISOString();
    const novoUsuario: Usuario = {
      id: generateId('USR'),
      nome: dto.nome.trim(),
      email: dto.email.trim().toLowerCase(),
      cargo: dto.cargo.trim(),
      status: dto.status || 'ATIVO',
      criadoEm: now,
      atualizadoEm: now,
    };

    const list = this.getAll();
    list.unshift(novoUsuario);
    setStorageItem(KEYS.USUARIOS, list);
    return novoUsuario;
  }

  public static update(id: string, dto: AtualizarUsuarioDTO): Usuario {
    const list = this.getAll();
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error('Usuário não encontrado.');
    }

    const current = list[index];
    const updatedData = { ...current, ...dto };

    const errors = this.validate(updatedData, id);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const updatedUsuario: Usuario = {
      ...updatedData,
      atualizadoEm: new Date().toISOString(),
    };

    list[index] = updatedUsuario;
    setStorageItem(KEYS.USUARIOS, list);
    return updatedUsuario;
  }

  public static delete(id: string): void {
    const associados = this.getEquipamentosAssociados(id);
    if (associados.length > 0) {
      const listaEquips = associados.map((eq) => `"${eq.modelo} (${eq.codigo})"`).join(', ');
      throw new Error(
        `Este usuário possui ${associados.length} equipamento(s) associado(s): ${listaEquips}. Reatribua ou desassocie os equipamentos antes de excluir.`
      );
    }

    const list = this.getAll().filter((u) => u.id !== id);
    setStorageItem(KEYS.USUARIOS, list);
  }
}
