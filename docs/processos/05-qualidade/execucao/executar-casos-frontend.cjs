// Executa casos da A13 contra o ChamadoService do frontend, compilado para CommonJS.
// Uso (na raiz):
//   npx tsc --outDir <dir> --module commonjs --target es2020 --moduleResolution node --skipLibCheck --rootDir src src/services/chamadoService.ts
//   node docs/processos/05-qualidade/execucao/executar-casos-frontend.cjs <dir>
const memoria = {};
global.localStorage = { getItem: (k) => (k in memoria ? memoria[k] : null), setItem: (k, v) => { memoria[k] = String(v); }, removeItem: (k) => { delete memoria[k]; } };
global.window = { addEventListener() {}, dispatchEvent() {} };
console.info = () => {};
const dir = require('path').resolve(process.argv[2]);
const { KEYS } = require(dir + '/services/storage.js');
const { ChamadoService } = require(dir + '/services/chamadoService.js');
const agora = new Date().toISOString();
const usuario = (id, nome) => ({ id, nome, email: '', cargo: 'Cliente', status: 'ATIVO', criadoEm: agora, atualizadoEm: agora });
const equipamento = (id, tipo, clienteId) => ({ id, codigo: id, tipo, fabricante: 'Dell', modelo: 'X', numeroSerie: id, status: 'ATIVO', clienteId, dataAquisicao: '', observacoes: '', criadoEm: agora, atualizadoEm: agora });
localStorage.setItem(KEYS.USUARIOS, JSON.stringify([usuario('CLI-1', 'Ana Souza'), usuario('CLI-2', 'Bruno Lima')]));
localStorage.setItem(KEYS.EQUIPAMENTOS, JSON.stringify([equipamento('EQ-1', 'NOTEBOOK', 'CLI-1'), equipamento('EQ-2', 'DESKTOP', 'CLI-2')]));
const registrar = (id, esperado, obtido, passou) => console.log(`${id} | esperado: ${esperado} | obtido: ${obtido} | ${passou ? 'PASSOU' : 'FALHOU'}`);
const ordem = (equipamentoId) => ({ titulo: 'Não liga', descricao: 'Não liga', clienteId: 'CLI-1', equipamentoId, prioridade: 'NORMAL' });

try {
  ChamadoService.create(ordem('EQ-2'));
  registrar('CT03', 'recusar equipamento de outro cliente', 'OS criada', false);
} catch (e) {
  const gravadas = ChamadoService.getAll().length;
  registrar('CT03', 'recusa "O equipamento selecionado não pertence ao cliente informado." e 0 OS gravadas', `"${e.message}"; OS gravadas: ${gravadas}`, e.message.includes('não pertence ao cliente') && gravadas === 0);
}

const os = ChamadoService.create(ordem('EQ-1'));
registrar('CT04', 'OS criada com identificador e estado inicial ABERTO', `id ${os.id}; estado ${os.status}`, Boolean(os.id) && os.status === 'ABERTO');

ChamadoService.updateStatus(os.id, 'CONCLUIDO');
try {
  const r = ChamadoService.updateStatus(os.id, 'ABERTO');
  registrar('CT09', 'CONCLUIDO -> ABERTO rejeitada; manter CONCLUIDO', `aceito: CONCLUIDO -> ${r.status}`, r.status === 'CONCLUIDO');
} catch (e) {
  registrar('CT09', 'CONCLUIDO -> ABERTO rejeitada', `rejeitado: ${e.message}`, true);
}
