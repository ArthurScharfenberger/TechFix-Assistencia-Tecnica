export type Route =
  | 'dashboard'
  | 'indicativos'
  | 'equipamentos'
  | 'usuarios'
  | 'chamados'
  | 'manutencoes'
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
    equipe: 'Gerencie os funcionários e técnicos da assistência',
  };
  return descriptions[route];
}
