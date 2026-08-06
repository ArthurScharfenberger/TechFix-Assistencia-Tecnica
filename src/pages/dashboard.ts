import { Chart, registerables } from 'chart.js';
import { EquipamentoService } from '../services/equipamentoService';
import { ChamadoService } from '../services/chamadoService';
import { ManutencaoService } from '../services/manutencaoService';
import { UsuarioService } from '../services/usuarioService';
import { FuncionarioService } from '../services/funcionarioService';
import { iconHTML, initIcons } from '../utils/iconHelper';
import { formatCurrency, getStatusChamadoBadge, getPrioridadeChamadoBadge, getStatusManutencaoBadge } from '../utils/formatters';

Chart.register(...registerables);

export class DashboardPage {
  private container: HTMLElement;
  private statusChart: Chart | null = null;
  private tipoChart: Chart | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'dashboard-page';
  }

  public destroy(): void {
    this.statusChart?.destroy();
    this.tipoChart?.destroy();
    this.statusChart = null;
    this.tipoChart = null;
  }

  public render(): HTMLElement {
    const equipamentos = EquipamentoService.getAll();
    const chamados = ChamadoService.getAll();
    const manutencoes = ManutencaoService.getAll();

    // Calculations
    const totalEquipamentos = equipamentos.length;
    const eqDisponiveis = equipamentos.filter((e) => e.status === 'DISPONIVEL').length;
    const eqEmUso = equipamentos.filter((e) => e.status === 'EM_USO').length;
    const eqEmManutencao = equipamentos.filter((e) => e.status === 'EM_MANUTENCAO').length;

    const chamadosAbertos = chamados.filter((c) => c.status === 'ABERTO' || c.status === 'EM_ATENDIMENTO' || c.status === 'AGUARDANDO_USUARIO').length;
    const chamadosUrgentes = chamados.filter((c) => c.prioridade === 'URGENTE' && c.status !== 'CONCLUIDO' && c.status !== 'CANCELADO').length;
    const chamadosConcluidos = chamados.filter((c) => c.status === 'CONCLUIDO').length;
    const tecnicosAtivos = FuncionarioService.getAssignable().length;
    const chamadosSemTecnico = chamados.filter((c) => !c.tecnicoResponsavelId && !['CONCLUIDO', 'CANCELADO'].includes(c.status)).length;

    const custoTotalManutencao = ManutencaoService.getCustoTotal();

    // Recent items
    const ultimosChamados = [...chamados].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()).slice(0, 5);
    const ultimasManutencoes = [...manutencoes].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()).slice(0, 5);

    this.container.innerHTML = `
      <!-- Stat Cards Grid -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Equipamentos cadastrados</div>
            <div class="stat-value">${totalEquipamentos}</div>
            <div class="stat-description">Aparelhos no cadastro</div>
          </div>
          <div class="stat-icon blue">${iconHTML('laptop', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Disponíveis</div>
            <div class="stat-value">${eqDisponiveis}</div>
            <div class="stat-description">Prontos para atendimento</div>
          </div>
          <div class="stat-icon green">${iconHTML('check-circle-2', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Com clientes</div>
            <div class="stat-value">${eqEmUso}</div>
            <div class="stat-description">Equipamentos atribuídos</div>
          </div>
          <div class="stat-icon purple">${iconHTML('user-check', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Em reparo</div>
            <div class="stat-value">${eqEmManutencao}</div>
            <div class="stat-description">Em atendimento técnico</div>
          </div>
          <div class="stat-icon amber">${iconHTML('wrench', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Ordens abertas</div>
            <div class="stat-value">${chamadosAbertos}</div>
            <div class="stat-description">Pendentes ou em andamento</div>
          </div>
          <div class="stat-icon blue">${iconHTML('ticket', '', 24)}</div>
        </div>

        <div class="card stat-card" style="${chamadosUrgentes > 0 ? 'border-color: rgba(239, 68, 68, 0.4);' : ''}">
          <div class="stat-info">
            <div class="stat-label">Ordens urgentes</div>
            <div class="stat-value" style="${chamadosUrgentes > 0 ? 'color: var(--color-danger);' : ''}">${chamadosUrgentes}</div>
          </div>
          <div class="stat-icon red">${iconHTML('alert-triangle', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Ordens concluídas</div>
            <div class="stat-value">${chamadosConcluidos}</div>
          </div>
          <div class="stat-icon green">${iconHTML('check-square', '', 24)}</div>
        </div>

        <div class="card stat-card">
          <div class="stat-info">
            <div class="stat-label">Valor dos serviços</div>
            <div class="stat-value" style="font-size: 1.35rem;">${formatCurrency(custoTotalManutencao)}</div>
          </div>
          <div class="stat-icon amber">${iconHTML('dollar-sign', '', 24)}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-info"><div class="stat-label">Técnicos ativos</div><div class="stat-value">${tecnicosAtivos}</div><div class="stat-description">Disponíveis para atribuição</div></div>
          <div class="stat-icon green">${iconHTML('user-cog', '', 24)}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-info"><div class="stat-label">Ordens sem técnico</div><div class="stat-value">${chamadosSemTecnico}</div><div class="stat-description">Abertas e sem responsável</div></div>
          <div class="stat-icon amber">${iconHTML('user-x', '', 24)}</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <div class="card chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Ordens por status</h3>
          </div>
          <div class="chart-container">
            <canvas id="chart-chamados-status"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Equipamentos por Tipo</h3>
          </div>
          <div class="chart-container">
            <canvas id="chart-equipamentos-tipo"></canvas>
          </div>
        </div>
      </div>

      <!-- Tables and Lists Section -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.5rem;">
        <!-- Recent Tickets -->
        <div class="table-container">
          <div class="table-toolbar">
            <h3 class="chart-title" style="display: flex; align-items: center; gap: 0.5rem;">
              ${iconHTML('clock', '', 18)} Ordens recentes
            </h3>
            <a href="#/chamados" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Ver todos</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ultimosChamados.length === 0
                    ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Nenhuma ordem de serviço registrada.</td></tr>`
                    : ultimosChamados
                        .map((c) => {
                          const sol = UsuarioService.getById(c.clienteId);
                          return `
                      <tr>
                        <td style="font-weight: 600;">${c.titulo}</td>
                        <td>${sol ? sol.nome : 'N/A'}</td>
                        <td>${getPrioridadeChamadoBadge(c.prioridade)}</td>
                        <td>${getStatusChamadoBadge(c.status)}</td>
                      </tr>
                    `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Maintenances -->
        <div class="table-container">
          <div class="table-toolbar">
            <h3 class="chart-title" style="display: flex; align-items: center; gap: 0.5rem;">
              ${iconHTML('wrench', '', 18)} Reparos recentes
            </h3>
            <a href="#/manutencoes" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Ver todas</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Equipamento</th>
                  <th>Técnico</th>
                  <th>Custo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ultimasManutencoes.length === 0
                    ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Nenhum reparo registrado.</td></tr>`
                    : ultimasManutencoes
                        .map((m) => {
                          const eq = EquipamentoService.getById(m.equipamentoId);
                          return `
                      <tr>
                        <td style="font-weight: 600;">${eq ? `${eq.modelo} (${eq.codigo})` : 'N/A'}</td>
                        <td>${FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado)}</td>
                        <td style="font-weight: 700; color: var(--color-warning);">${formatCurrency(m.custo)}</td>
                        <td>${getStatusManutencaoBadge(m.status)}</td>
                      </tr>
                    `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

    `;

    setTimeout(() => {
      this.initCharts(chamados, equipamentos);
    }, 50);

    initIcons(this.container);
    return this.container;
  }

  private initCharts(chamados: any[], equipamentos: any[]): void {
    if (this.statusChart) this.statusChart.destroy();
    if (this.tipoChart) this.tipoChart.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#9ca3af' : '#4b5563';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    // Status Chamados Chart Data
    const statusCounts: Record<string, number> = {
      Aberta: chamados.filter((c) => c.status === 'ABERTO').length,
      'Em Atendimento': chamados.filter((c) => c.status === 'EM_ATENDIMENTO').length,
      'Aguardando cliente': chamados.filter((c) => c.status === 'AGUARDANDO_USUARIO').length,
      Concluída: chamados.filter((c) => c.status === 'CONCLUIDO').length,
      Cancelada: chamados.filter((c) => c.status === 'CANCELADO').length,
    };

    const statusCtx = (this.container.querySelector('#chart-chamados-status') as HTMLCanvasElement)?.getContext('2d');
    if (statusCtx) {
      this.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusCounts),
          datasets: [
            {
              data: Object.values(statusCounts),
              backgroundColor: ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#6b7280'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } },
            },
          },
        },
      });
    }

    // Tipo Equipamentos Chart Data
    const tipoCounts: Record<string, number> = {
      Notebook: equipamentos.filter((e) => e.tipo === 'NOTEBOOK').length,
      Desktop: equipamentos.filter((e) => e.tipo === 'DESKTOP').length,
      Monitor: equipamentos.filter((e) => e.tipo === 'MONITOR').length,
      Impressora: equipamentos.filter((e) => e.tipo === 'IMPRESSORA').length,
      Celular: equipamentos.filter((e) => e.tipo === 'CELULAR').length,
      Outro: equipamentos.filter((e) => e.tipo === 'OUTRO').length,
    };

    const tipoCtx = (this.container.querySelector('#chart-equipamentos-tipo') as HTMLCanvasElement)?.getContext('2d');
    if (tipoCtx) {
      this.tipoChart = new Chart(tipoCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(tipoCounts),
          datasets: [
            {
              label: 'Quantidade',
              data: Object.values(tipoCounts),
              backgroundColor: '#3b82f6',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor, stepSize: 1 },
              grid: { color: gridColor },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
