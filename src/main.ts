import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/tables.css';
import './styles/forms.css';
import './styles/responsive.css';
import './styles/login.css';
import './styles/reports.css';
import './styles/report-charts.css';
import './styles/workshop.css';

import { getStorageItem, setStorageItem, KEYS, AppConfiguration } from './services/storage';
import { App } from './app';
import { installGlobalErrorHandlers, logger } from './services/logger';
import { EquipamentoService } from './services/equipamentoService';
import { UsuarioService } from './services/usuarioService';
import { ChamadoService } from './services/chamadoService';
import { ManutencaoService } from './services/manutencaoService';
import { AuthService } from './services/authService';
import { LoginPage } from './pages/login';
import { initIcons } from './utils/iconHelper';

installGlobalErrorHandlers();

document.addEventListener('DOMContentLoaded', () => {
  logger.info('Inicialização da aplicação.', { version: '1.0.0', route: window.location.hash || '#/dashboard' });
  // Migra somente registros legados existentes. Dados de demonstração não são mais recriados automaticamente.
  EquipamentoService.migrateLegacyData();
  UsuarioService.migrateLegacyData();
  ChamadoService.migrateLegacyData();
  ManutencaoService.migrateLegacyData();

  // Load theme preference or match media system default
  const configs = getStorageItem<AppConfiguration>(KEYS.CONFIGURACOES, {});
  // Introduce the approved white workspace once; subsequent theme choices remain saved.
  if (configs.visualVersion !== 'workshop-v1') {
    configs.theme = 'light';
    configs.visualVersion = 'workshop-v1';
    setStorageItem(KEYS.CONFIGURACOES, configs);
  }
  let theme = configs.theme;

  if (!theme) {
    theme = 'light';
  }

  document.documentElement.setAttribute('data-theme', theme);

  const mountApp = (): void => {
    const app = new App('app');
    app.init();
    logger.info('Aplicação inicializada com sucesso.');
  };

  AuthService.initialize();
  if (!AuthService.isAuthenticated()) {
    AuthService.preserveIntendedRoute(window.location.hash);
    if (window.location.hash !== '#/login') history.replaceState(null, '', '#/login');
    const root = document.getElementById('app');
    if (!root) throw new Error('Root element #app not found.');
    root.replaceChildren(new LoginPage().render());
    initIcons(root);
    window.addEventListener('hashchange', () => {
      if (AuthService.isAuthenticated()) return;
      AuthService.preserveIntendedRoute(window.location.hash);
      if (window.location.hash !== '#/login') history.replaceState(null, '', '#/login');
    });
    window.addEventListener('techfix:authenticated', mountApp, { once: true });
    logger.info('Tela de autenticação inicializada.');
    return;
  }

  if (window.location.hash === '#/login') history.replaceState(null, '', '#/dashboard');

  mountApp();
});
