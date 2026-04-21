import { Icon } from '@chakra-ui/react';
import { BsMusicNoteBeamed, BsShieldFillCheck } from 'react-icons/bs';
import { FaGamepad, FaUserShield, FaRobot } from 'react-icons/fa';
import { IoHappy } from 'react-icons/io5';
import {
  MdAddReaction,
  MdMessage,
  MdSecurity,
  MdAutoAwesome,
  MdBarChart,
  MdRecordVoiceOver,
  MdEmojiEvents,
  MdAnnouncement,
  MdManageAccounts,
} from 'react-icons/md';
import { RiSwordFill } from 'react-icons/ri';
import { FeaturesConfig } from './types';
import { provider } from '@/config/translations/provider';
import { createI18n } from '@/utils/i18n';
import { useWelcomeMessageFeature } from './example/WelcomeMessageFeature';
import { useMemeFeature } from './example/MemeFeature';

const { T } = createI18n(provider, {
  en: {
    music: 'Music Player',
    'music description': 'Play music from YouTube, Spotify & SoundCloud in your server',
    gaming: 'Fun & Games',
    'gaming description': 'Mini-games, trivia, 8ball and more for your community',
    'reaction role': 'Reaction Roles',
    'reaction role description': 'Let members self-assign roles by clicking buttons',
    memes: 'Memes & Fun',
    'memes description': 'Auto-post memes, jokes and fun content daily',
    moderation: 'Moderation',
    'moderation description': 'Ban, kick, mute, warn and manage your members easily',
    antinuke: 'Anti-Nuke Protection',
    'antinuke description': 'Protect your server from raids, mass bans, and nukes',
    automod: 'Auto Moderation',
    'automod description': 'Auto-filter spam, links, caps, mentions and bad words',
    levels: 'Leveling & Economy',
    'levels description': 'XP system with global economy, leaderboards and rewards',
    logging: 'Server Logging',
    'logging description': 'Log all mod actions, joins, leaves, edits and more',
    voicemaster: 'Voice Master',
    'voicemaster description': 'Let members create and manage their own voice channels',
    welcome: 'Welcome Messages',
    'welcome description': 'Custom welcome cards and messages for new members',
    tracker: 'Invite Tracker',
    'tracker description': 'Track who invited who and manage invite leaderboards',
    autoreact: 'Auto React',
    'autoreact description': 'Auto-react to messages with custom emojis and triggers',
    roles: 'Role Management',
    'roles description': 'Advanced role assignment, auto-roles and role menus',
  },
  cn: {
    music: '音樂播放器',
    'music description': '在您的服務器中播放 YouTube、Spotify 和 SoundCloud 音樂',
    gaming: '趣味遊戲',
    'gaming description': '小遊戲、問答和更多社區互動',
    'reaction role': '反應身份組',
    'reaction role description': '讓成員通過點擊按鈕自我分配角色',
    memes: '表情包和趣味',
    'memes description': '每天自動發布表情包和有趣內容',
    moderation: '服務器管理',
    'moderation description': '輕鬆封禁、踢出、禁言和警告成員',
    antinuke: '反核保護',
    'antinuke description': '保護您的服務器免受突襲和批量封禁',
    automod: '自動管理',
    'automod description': '自動過濾垃圾信息、鏈接和不良詞語',
    levels: '等級和經濟',
    'levels description': '全球經濟系統、排行榜和獎勵',
    logging: '服務器日誌',
    'logging description': '記錄所有管理操作、加入、離開和更多',
    voicemaster: '語音大師',
    'voicemaster description': '讓成員創建和管理自己的語音頻道',
    welcome: '歡迎消息',
    'welcome description': '為新成員提供自定義歡迎卡片和消息',
    tracker: '邀請追蹤',
    'tracker description': '追蹤誰邀請了誰並管理邀請排行榜',
    autoreact: '自動反應',
    'autoreact description': '使用自定義表情符號自動回應消息',
    roles: '身份組管理',
    'roles description': '高級角色分配、自動角色和角色菜單',
  },
});

export const features: FeaturesConfig = {
  'welcome-message': {
    name: <T text="welcome" />,
    description: <T text="welcome description" />,
    icon: <Icon as={MdMessage} />,
    useRender: useWelcomeMessageFeature,
  },
  music: {
    name: <T text="music" />,
    description: <T text="music description" />,
    icon: <Icon as={BsMusicNoteBeamed} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  moderation: {
    name: <T text="moderation" />,
    description: <T text="moderation description" />,
    icon: <Icon as={RiSwordFill} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  antinuke: {
    name: <T text="antinuke" />,
    description: <T text="antinuke description" />,
    icon: <Icon as={BsShieldFillCheck} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  automod: {
    name: <T text="automod" />,
    description: <T text="automod description" />,
    icon: <Icon as={MdSecurity} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  levels: {
    name: <T text="levels" />,
    description: <T text="levels description" />,
    icon: <Icon as={MdEmojiEvents} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  logging: {
    name: <T text="logging" />,
    description: <T text="logging description" />,
    icon: <Icon as={MdBarChart} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  voicemaster: {
    name: <T text="voicemaster" />,
    description: <T text="voicemaster description" />,
    icon: <Icon as={MdRecordVoiceOver} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  tracker: {
    name: <T text="tracker" />,
    description: <T text="tracker description" />,
    icon: <Icon as={MdManageAccounts} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  autoreact: {
    name: <T text="autoreact" />,
    description: <T text="autoreact description" />,
    icon: <Icon as={MdAddReaction} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  roles: {
    name: <T text="roles" />,
    description: <T text="roles description" />,
    icon: <Icon as={FaUserShield} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  gaming: {
    name: <T text="gaming" />,
    description: <T text="gaming description" />,
    icon: <Icon as={FaGamepad} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
  meme: {
    name: <T text="memes" />,
    description: <T text="memes description" />,
    icon: <Icon as={IoHappy} />,
    useRender: useMemeFeature,
  },
  'reaction-role': {
    name: <T text="reaction role" />,
    description: <T text="reaction role description" />,
    icon: <Icon as={MdAutoAwesome} />,
    useRender() {
      return { component: <></>, onSubmit: () => {} };
    },
  },
};
