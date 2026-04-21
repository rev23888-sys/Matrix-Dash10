import { provider } from './provider';
import { createI18n } from '@/utils/i18n';

export const dashboard = createI18n(provider, {
  en: {
    pricing: 'Commands',
    learn_more: 'Support Server',
    invite: {
      title: 'Invite Matrix Bot',
      description: 'Add Matrix Bot to your server and unlock powerful moderation, leveling, music, and more!',
      bn: 'Invite Matrix Bot',
    },
    servers: {
      title: 'Your Servers',
      description: 'Select a server to configure Matrix Bot',
    },
    vc: {
      create: 'Create a voice channel',
      'created channels': 'Active Voice Channels',
    },
    command: {
      title: 'Command Usage',
      description: 'Commands used across your servers this month',
    },
    stats: {
      title: 'Bot Statistics',
      members: 'Total Members',
      servers: 'Servers',
      commands: 'Commands Run',
      uptime: 'Uptime',
    },
    features: {
      title: 'Matrix Bot Features',
      description: 'Everything you need to manage and grow your Discord server',
    },
    quick_actions: {
      title: 'Quick Actions',
      support: 'Support Server',
      invite: 'Invite Bot',
      vote: 'Vote on Top.gg',
      docs: 'Documentation',
    },
  },
  cn: {
    pricing: '命令列表',
    learn_more: '支援服務器',
    invite: {
      title: '邀請 Matrix 機器人',
      description: '將 Matrix Bot 添加到您的服務器，解鎖強大的管理、等級、音樂等功能！',
      bn: '邀請 Matrix Bot',
    },
    servers: {
      title: '您的服務器',
      description: '選擇一個服務器來配置 Matrix Bot',
    },
    vc: {
      create: '創建語音通道',
      'created channels': '活躍語音頻道',
    },
    command: {
      title: '命令使用量',
      description: '本月您的服務器使用的命令',
    },
    stats: {
      title: '機器人統計',
      members: '總成員數',
      servers: '服務器數量',
      commands: '命令執行次數',
      uptime: '運行時間',
    },
    features: {
      title: 'Matrix Bot 功能',
      description: '管理和發展 Discord 服務器所需的一切',
    },
    quick_actions: {
      title: '快速操作',
      support: '支援服務器',
      invite: '邀請機器人',
      vote: '在 Top.gg 投票',
      docs: '文檔',
    },
  },
});
