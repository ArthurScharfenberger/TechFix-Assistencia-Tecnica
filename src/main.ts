import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/tables.css';
import './styles/forms.css';
import './styles/responsive.css';

import { getStorageItem, KEYS } from './services/storage';
import { App } from './app';
import { installGlobalErrorHandlers, logger } from './services/logger';
import { EquipamentoService } from './services/equipamentoService';
import { UsuarioService } from './services/usuarioService';
import { ChamadoService } from './services/chamadoService';
import { ManutencaoService } from './services/manutencaoService';

installGlobalErrorHandlers();

document.addEventListener('DOMContentLoaded', () => {
  logger.info('Inicialização da aplicação.', { version: '1.0.0', route: window.location.hash || '#/dashboard' });
  // Migra somente registros legados existentes. Dados de demonstração não são mais recriados automaticamente.
  EquipamentoService.migrateLegacyData();
  UsuarioService.migrateLegacyData();
  ChamadoService.migrateLegacyData();
  ManutencaoService.migrateLegacyData();

  // Load theme preference or match media system default
  const configs = getStorageItem<{ theme?: string }>(KEYS.CONFIGURACOES, {});
  let theme = configs.theme;

  if (!theme) {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    theme = prefersLight ? 'light' : 'dark';
  }

  document.documentElement.setAttribute('data-theme', theme);

  // Instantiate and mount App
  const app = new App('app');
  app.init();
  logger.info('Aplicação inicializada com sucesso.');
});
