import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const common = createI18n(provider, {
  en: {
    loading: 'Loading',
    search: 'Search servers...',
    'select lang': 'Select your language',
    'select role': 'Select a role',
    'select channel': 'Select a channel',
    dashboard: 'Dashboard',
    profile: 'Profile',
    pages: 'Home',
    logout: 'Logout',
  },
  cn: {
    loading: '加載中',
    search: '搜索服務器',
    'select lang': '選擇你的語言',
    'select role': '選擇身份組',
    'select channel': '選擇頻道',
    dashboard: '控制台',
    profile: '用戶資料',
    pages: '主頁',
    logout: '登出',
  },
});
