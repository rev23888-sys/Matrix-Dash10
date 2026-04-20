import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const auth = createI18n(provider, {
  en: {
    login: 'Welcome to Matrix Dashboard',
    'login description': 'Login with Discord to manage your servers and configure Matrix Bot',
    login_bn: 'Login with Discord',
  },
  cn: {
    login: '歡迎使用 Matrix 控制台',
    'login description': '使用 Discord 登錄以管理您的服務器',
    login_bn: '使用 Discord 登錄',
  },
});
