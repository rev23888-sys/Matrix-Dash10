import { Icon }                     from '@chakra-ui/react';
import { BsMusicNoteBeamed, BsShieldFillCheck } from 'react-icons/bs';
import { FaGamepad, FaUserShield, FaTicketAlt, FaGift } from 'react-icons/fa';
import { IoHappy }                  from 'react-icons/io5';
import {
  MdAddReaction, MdMessage, MdSecurity, MdAutoAwesome, MdBarChart,
  MdRecordVoiceOver, MdEmojiEvents, MdManageAccounts,
  MdAttachMoney, MdWavingHand,
} from 'react-icons/md';
import { RiSwordFill }              from 'react-icons/ri';
import { FeaturesConfig, UseFormRender } from './types';
import { provider }                 from '@/config/translations/provider';
import { createI18n }               from '@/utils/i18n';
import { useWelcomeMessageFeature } from './example/WelcomeMessageFeature';
import { useMemeFeature }           from './example/MemeFeature';

const { T } = createI18n(provider, {
  en: {
    'welcome-message':   'Welcome Message',   'welcome-message d': 'Greet new members with a custom message',
    goodbye:             'Goodbye Message',   'goodbye d':         'Send a goodbye message when members leave',
    meme:                'Meme Feed',         'meme d':            'Auto-post memes in a channel',
    'reaction-role':     'Reaction Roles',    'reaction-role d':   'Let members self-assign roles',
    gaming:              'Gaming',            'gaming d':          'Fun gaming commands',
    music:               'Music Player',      'music d':           'YouTube, Spotify & SoundCloud',
    moderation:          'Moderation',        'moderation d':      'Ban, kick, mute, warn members',
    antinuke:            'Anti-Nuke',         'antinuke d':        'Protect against raids & nukes',
    automod:             'Auto Moderation',   'automod d':         'Filter spam, links & bad words',
    levels:              'Levels & XP',       'levels d':          'XP system with rewards & leaderboard',
    logging:             'Server Logs',       'logging d':         'Log all server events',
    voicemaster:         'Voice Master',      'voicemaster d':     'Temporary voice channels',
    tracker:             'Invite Tracker',    'tracker d':         'Track invites and messages',
    autoreact:           'Auto React',        'autoreact d':       'Auto-react to messages',
    roles:               'Role Manager',      'roles d':           'Auto-roles & role menus',
    economy:             'Economy',           'economy d':         'Coins, shop, and rewards',
    tickets:             'Tickets',           'tickets d':         'Support ticket system',
    giveaways:           'Giveaways',         'giveaways d':       'Create and manage giveaways',
  },
  cn: {
    'welcome-message':   '歡迎消息', 'welcome-message d': '為新成員發送自定義歡迎消息',
    goodbye:             '離別消息', 'goodbye d':         '當成員離開時發送消息',
    meme:                '表情包',   'meme d':            '自動發布表情包',
    'reaction-role':     '反應角色', 'reaction-role d':   '讓成員自助選擇角色',
    gaming:              '遊戲',     'gaming d':          '趣味遊戲命令',
    music:               '音樂播放', 'music d':           'YouTube Spotify SoundCloud',
    moderation:          '管理',     'moderation d':      '封禁踢出靜音警告',
    antinuke:            '防核',     'antinuke d':        '防止突襲和大規模封禁',
    automod:             '自動管理', 'automod d':         '過濾垃圾信息和不良詞語',
    levels:              '等級系統', 'levels d':          'XP系統和排行榜',
    logging:             '服務器日誌','logging d':        '記錄所有服務器事件',
    voicemaster:         '語音大師', 'voicemaster d':     '臨時語音頻道',
    tracker:             '邀請追蹤', 'tracker d':         '追蹤邀請和消息',
    autoreact:           '自動反應', 'autoreact d':       '自動回應消息',
    roles:               '角色管理', 'roles d':           '自動角色和角色菜單',
    economy:             '經濟系統', 'economy d':         '金幣商店和獎勵',
    tickets:             '工單系統', 'tickets d':         '支援工單系統',
    giveaways:           '抽獎',     'giveaways d':       '創建和管理抽獎',
  },
});

/** Placeholder render for features that don't have a custom form UI yet */
const noop: UseFormRender<any> = (_data, _onSubmit) => ({
  component: <></>,
  onSubmit:  () => {},
  canSave:   false,
});

export const features: FeaturesConfig = {
  'welcome-message': {
    name:        <T text="welcome-message" />,
    description: <T text="welcome-message d" />,
    icon:        <Icon as={MdMessage} />,
    useRender:   useWelcomeMessageFeature,
  },
  goodbye: {
    name:        <T text="goodbye" />,
    description: <T text="goodbye d" />,
    icon:        <Icon as={MdWavingHand} />,
    useRender:   noop,
  },
  meme: {
    name:        <T text="meme" />,
    description: <T text="meme d" />,
    icon:        <Icon as={IoHappy} />,
    useRender:   useMemeFeature,
  },
  'reaction-role': {
    name:        <T text="reaction-role" />,
    description: <T text="reaction-role d" />,
    icon:        <Icon as={MdAutoAwesome} />,
    useRender:   noop,
  },
  gaming: {
    name:        <T text="gaming" />,
    description: <T text="gaming d" />,
    icon:        <Icon as={FaGamepad} />,
    useRender:   noop,
  },
  music: {
    name:        <T text="music" />,
    description: <T text="music d" />,
    icon:        <Icon as={BsMusicNoteBeamed} />,
    useRender:   noop,
  },
  moderation: {
    name:        <T text="moderation" />,
    description: <T text="moderation d" />,
    icon:        <Icon as={RiSwordFill} />,
    useRender:   noop,
  },
  antinuke: {
    name:        <T text="antinuke" />,
    description: <T text="antinuke d" />,
    icon:        <Icon as={BsShieldFillCheck} />,
    useRender:   noop,
  },
  automod: {
    name:        <T text="automod" />,
    description: <T text="automod d" />,
    icon:        <Icon as={MdSecurity} />,
    useRender:   noop,
  },
  levels: {
    name:        <T text="levels" />,
    description: <T text="levels d" />,
    icon:        <Icon as={MdEmojiEvents} />,
    useRender:   noop,
  },
  logging: {
    name:        <T text="logging" />,
    description: <T text="logging d" />,
    icon:        <Icon as={MdBarChart} />,
    useRender:   noop,
  },
  voicemaster: {
    name:        <T text="voicemaster" />,
    description: <T text="voicemaster d" />,
    icon:        <Icon as={MdRecordVoiceOver} />,
    useRender:   noop,
  },
  tracker: {
    name:        <T text="tracker" />,
    description: <T text="tracker d" />,
    icon:        <Icon as={MdManageAccounts} />,
    useRender:   noop,
  },
  autoreact: {
    name:        <T text="autoreact" />,
    description: <T text="autoreact d" />,
    icon:        <Icon as={MdAddReaction} />,
    useRender:   noop,
  },
  roles: {
    name:        <T text="roles" />,
    description: <T text="roles d" />,
    icon:        <Icon as={FaUserShield} />,
    useRender:   noop,
  },
  economy: {
    name:        <T text="economy" />,
    description: <T text="economy d" />,
    icon:        <Icon as={MdAttachMoney} />,
    useRender:   noop,
  },
  tickets: {
    name:        <T text="tickets" />,
    description: <T text="tickets d" />,
    icon:        <Icon as={FaTicketAlt} />,
    useRender:   noop,
  },
  giveaways: {
    name:        <T text="giveaways" />,
    description: <T text="giveaways d" />,
    icon:        <Icon as={FaGift} />,
    useRender:   noop,
  },
};
