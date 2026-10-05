import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

process.env.TZ = 'America/Sao_Paulo';
const build = fs.mkdtempSync(path.join(os.tmpdir(), 'techfix-tests-'));
function compile(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const input = path.join(dir, entry.name);
    if (entry.isDirectory()) { compile(input); continue; }
    if (!input.endsWith('.ts') || input.endsWith('.d.ts')) continue;
    const output = path.join(build, path.relative('src', input).replace(/\.ts$/, '.js'));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, ts.transpileModule(fs.readFileSync(input, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText);
  }
}
compile('src');
after(() => fs.rmSync(build, { recursive: true, force: true }));
const require = createRequire(import.meta.url);
const { EquipamentoService } = require(path.join(build, 'services/equipamentoService.js'));
const { ManutencaoService } = require(path.join(build, 'services/manutencaoService.js'));
const { ChamadoService } = require(path.join(build, 'services/chamadoService.js'));
const { formatDate } = require(path.join(build, 'utils/formatters.js'));
const { todayDate, parseDateOnly } = require(path.join(build, 'utils/dates.js'));
const { isNonNegativeNumber } = require(path.join(build, 'utils/validators.js'));
const data = new Map();
globalThis.localStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
function setup() {
  data.clear();
  data.set('tiControl_equipamentos', JSON.stringify(['a', 'b'].map(id => ({ id, codigo: `TFX-EQP-00000${id === 'a' ? 1 : 2}`, tipo: 'NOTEBOOK', fabricante: 'Dell', modelo: 'Teste', numeroSerie: '', clienteId: 'c', dataAquisicao: '2026-10-05', status: 'DISPONIVEL' }))));
}
function repair(equipamentoId = 'a') { return ManutencaoService.create({ equipamentoId, descricao: 'Diagnóstico', tecnicoResponsavelId: null, custo: 10, dataInicio: todayDate(), status: 'EM_ANDAMENTO' }); }

test('datas civis não retrocedem um dia e seguem o calendário local', () => {
  assert.equal(formatDate('2026-10-05'), '05/10/2026');
  assert.equal(todayDate(new Date('2026-10-06T01:00:00Z')), '2026-10-05');
  assert.equal(parseDateOnly('2026-02-30'), null);
  assert.equal(formatDate('2026-02-30'), '2026-02-30');
});
test('concluir um reparo mantém equipamento em manutenção enquanto há outro ativo', () => {
  setup(); const first = repair(); const second = repair();
  ManutencaoService.concluir(first.id);
  assert.equal(EquipamentoService.getById('a').status, 'EM_MANUTENCAO');
  ManutencaoService.concluir(second.id);
  assert.equal(EquipamentoService.getById('a').status, 'DISPONIVEL');
});
test('trocar equipamento, cancelar e excluir recalculam os estados afetados', () => {
  setup(); const item = repair();
  ManutencaoService.update(item.id, { equipamentoId: 'b' });
  assert.equal(EquipamentoService.getById('a').status, 'DISPONIVEL');
  assert.equal(EquipamentoService.getById('b').status, 'EM_MANUTENCAO');
  ManutencaoService.update(item.id, { status: 'CANCELADA' });
  assert.equal(EquipamentoService.getById('b').status, 'DISPONIVEL');
  const another = repair(); ManutencaoService.delete(another.id);
  assert.equal(EquipamentoService.getById('a').status, 'DISPONIVEL');
});
test('ordens e reparos recusam equipamento fora do escopo ou descartado', () => {
  setup(); const items = JSON.parse(data.get('tiControl_equipamentos'));
  for (const invalid of [{ tipo: 'INVALIDO' }, { status: 'DESCARTADO' }]) {
    data.set('tiControl_equipamentos', JSON.stringify([{ ...items[0], ...invalid }]));
    const errors = ChamadoService.validate({ equipamentoId: 'a', clienteId: 'c' });
    assert.ok(errors.some(error => /apenas notebooks|descartado/.test(error)));
    assert.throws(() => repair(), /apenas notebooks|descartado/);
  }
});
test('validação rejeita custo infinito, data impossível e status desconhecido', () => {
  setup(); assert.equal(isNonNegativeNumber(Infinity), false);
  assert.throws(() => ManutencaoService.create({ equipamentoId: 'a', descricao: 'Teste', tecnicoResponsavelId: null, custo: 0, dataInicio: '2026-02-30', status: 'INVALIDO' }), /data de início é inválida.*status do reparo é inválido/);
});
