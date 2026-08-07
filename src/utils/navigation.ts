export type Route =
  | 'dashboard'
  | 'indicativos'
  | 'equipamentos'
  | 'usuarios'
  | 'chamados'
  | 'manutencoes'
  | 'relatorios'
  | 'relatorios/ordens'
  | 'relatorios/reparos'
  | 'relatorios/equipe'
  | 'relatorios/clientes-equipamentos'
  | 'equipe';

export const DEFAULT_ROUTE: Route = 'dashboard';

export function getCurrentRoute(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  const validRoutes: Route[] = [
    'dashboard',
    'indicativos',
    'equipamentos',
    'usuarios',
    'chamados',
    'manutencoes',
    'relatorios',
    'relatorios/ordens',
    'relatorios/reparos',
    'relatorios/equipe',
    'relatorios/clientes-equipamentos',
    'equipe',
  ];
  return validRoutes.includes(hash as Route) ? (hash as Route) : DEFAULT_ROUTE;
}

export function navigateTo(route: Route): void {
  window.location.hash = `#/${route}`;
}

export function getRouteTitle(route: Route): string {
  const titles: Record<Route, string> = {
    dashboard: 'Visão geral',
    indicativos: 'Indicativos',
    equipamentos: 'Equipamentos',
    usuarios: 'Clientes',
    chamados: 'Ordens de serviço',
    manutencoes: 'Reparos',
    relatorios: 'Relatórios',
    'relatorios/ordens': 'Relatório de Ordens de Serviço',
    'relatorios/reparos': 'Relatório de Reparos e Custos',
    'relatorios/equipe': 'Relatório da Equipe',
    'relatorios/clientes-equipamentos': 'Relatório de Clientes e Equipamentos',
    equipe: 'Equipe',
  };
  return titles[route] || 'TechFix';
}

export function getRouteDescription(route: Route): string {
  const descriptions: Record<Route, string> = {
    dashboard: 'Indicadores e atividade recente da assistência técnica',
    indicativos: 'Analise o desempenho, o volume de atendimentos e os resultados da assistência técnica',
    equipamentos: 'Aparelhos cadastrados, responsáveis e situação atual',
    usuarios: 'Cadastro e acompanhamento dos clientes atendidos',
    chamados: 'Abertura e acompanhamento dos atendimentos técnicos',
    manutencoes: 'Serviços realizados, custos e histórico de reparos',
    relatorios: 'Consulte, filtre e exporte informações da assistência técnica',
    'relatorios/ordens': 'Consulta estruturada das ordens de serviço',
    'relatorios/reparos': 'Serviços realizados, custos e valores por período',
    'relatorios/equipe': 'Produtividade e atendimentos por técnico',
    'relatorios/clientes-equipamentos': 'Histórico, recorrência e volume de atendimentos',
    equipe: 'Gerencie os funcionários e técnicos da assistência',
  };
  return descriptions[route];
}
