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
      <!-- Executive KPI Cards (4 clean high-level metrics) -->
      <div class="dashboard-kpi-grid">
        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Ordens Ativas</span>
            <span class="kpi-icon ${chamadosUrgentes > 0 ? 'amber' : 'green'}">${iconHTML('clipboard-list', '', 18)}</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">${chamadosAbertos}</span>
            <div class="kpi-meta">
              ${chamadosUrgentes > 0 ? `<span class="kpi-tag danger">${chamadosUrgentes} urgente(s)</span>` : `<span class="kpi-tag neutral">Nenhuma urgente</span>`}
              <span class="kpi-sub">${chamadosSemTecnico} sem técnico</span>
            </div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Reparos Técnicos</span>
            <span class="kpi-icon green">${iconHTML('wrench', '', 18)}</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">${eqEmManutencao}</span>
            <div class="kpi-meta">
              <span class="kpi-tag neutral">${manutencoes.filter((m) => m.status === 'CONCLUIDA').length} concluído(s)</span>
              <span class="kpi-sub">Em bancada</span>
            </div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Equipamentos</span>
            <span class="kpi-icon green">${iconHTML('laptop', '', 18)}</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-value">${totalEquipamentos}</span>
            <div class="kpi-meta">
              <span class="kpi-tag success">${eqDisponiveis} disponíveis</span>
              <span class="kpi-sub">${eqEmUso} com clientes</span>
            </div>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Faturamento Total</span>
            <span class="kpi-icon amber">${iconHTML('dollar-sign', '', 18)}</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-value kpi-currency">${formatCurrency(custoTotalManutencao)}</span>
            <div class="kpi-meta">
              <span class="kpi-tag neutral">${tecnicosAtivos} técnicos ativos</span>
              <span class="kpi-sub">Total de serviços</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action / Status Ribbon -->
      <div class="dashboard-ribbon">
        <div class="ribbon-item">
          <span class="ribbon-dot success"></span>
          <span class="ribbon-text"><strong>${tecnicosAtivos}</strong> técnicos disponíveis</span>
        </div>
        <div class="ribbon-item">
          <span class="ribbon-dot info"></span>
          <span class="ribbon-text"><strong>${chamadosConcluidos}</strong> ordens finalizadas</span>
        </div>
        <div class="ribbon-item">
          <span class="ribbon-dot ${chamadosSemTecnico > 0 ? 'warning' : 'neutral'}"></span>
          <span class="ribbon-text"><strong>${chamadosSemTecnico}</strong> ordens aguardando atribuição</span>
        </div>
        <div class="ribbon-actions">
          <a href="#/chamados" class="btn btn-secondary btn-sm">${iconHTML('plus', '', 14)} Nova ordem</a>
          <a href="#/indicativos" class="btn btn-secondary btn-sm">${iconHTML('bar-chart-3', '', 14)} Ver indicativos</a>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <div class="card chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Distribuição de Ordens</h3>
              <p class="chart-desc">Status atual dos atendimentos</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="chart-chamados-status"></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">Equipamentos por Tipo</h3>
              <p class="chart-desc">Volume cadastrado por categoria</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="chart-equipamentos-tipo"></canvas>
          </div>
        </div>
      </div>

      <!-- Tables and Lists Section -->
      <div class="dashboard-tables-grid">
        <!-- Recent Tickets -->
        <div class="table-container">
          <div class="table-toolbar">
            <div class="table-toolbar-title">
              <h3>Ordens Recentes</h3>
              <small>Últimos chamados abertos</small>
            </div>
            <a href="#/chamados" class="btn btn-secondary btn-sm">Ver todas</a>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Cliente</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  ultimosChamados.length === 0
                    ? `<tr><td colspan="4" class="empty-table-message">Nenhuma ordem de serviço registrada.</td></tr>`
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
            <div class="table-toolbar-title">
              <h3>Reparos Recentes</h3>
              <small>Últimas manutenções na bancada</small>
            </div>
            <a href="#/manutencoes" class="btn btn-secondary btn-sm">Ver todos</a>
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
                    ? `<tr><td colspan="4" class="empty-table-message">Nenhum reparo registrado.</td></tr>`
                    : ultimasManutencoes
                        .map((m) => {
                          const eq = EquipamentoService.getById(m.equipamentoId);
                          return `
                      <tr>
                        <td style="font-weight: 600;">${eq ? `${eq.modelo}` : 'N/A'}</td>
                        <td>${FuncionarioService.resolveName(m.tecnicoResponsavelId, m.tecnicoResponsavelNomeLegado)}</td>
                        <td style="font-weight: 600;">${formatCurrency(m.custo)}</td>
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
    const textColor = isDark ? '#9ea8b3' : '#575e57';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

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
              backgroundColor: ['#4ea8de', '#e5a33c', '#9d8cd7', '#4ec986', '#6f7883'],
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
              backgroundColor: isDark ? '#d4ea27' : '#3d5e16',
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
