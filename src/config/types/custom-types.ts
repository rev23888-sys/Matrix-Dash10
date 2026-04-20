/***
 * Custom types — Matrix Bot Dashboard
 * Every key in CustomFeatures MUST have a matching entry in features.tsx
 ***/

import { z } from 'zod';
import { GuildInfo } from './types';

export type CustomGuildInfo = GuildInfo & {
  /** Set by the bot backend — true when the bot is in this guild */
  botPresent?: boolean;
  memberCount?: number;
  prefix?: string;
};

export type CustomFeatures = {
  // ── Core examples (keep for compat) ─────────────────────────
  'welcome-message': WelcomeMessageFeature;
  meme:              MemeFeature;
  'reaction-role':   ReactionRoleFeature;
  gaming:            {};
  music:             MusicFeature;

  // ── Matrix Bot features ──────────────────────────────────────
  moderation:   ModerationFeature;
  antinuke:     AntinukeFeature;
  automod:      AutomodFeature;
  levels:       LevelsFeature;
  logging:      LoggingFeature;
  voicemaster:  VoicemasterFeature;
  tracker:      TrackerFeature;
  autoreact:    AutoreactFeature;
  roles:        RolesFeature;
  economy:      EconomyFeature;
  tickets:      TicketsFeature;
  giveaways:    GiveawaysFeature;
  goodbye:      GoodbyeFeature;
};

// ── WELCOME ──────────────────────────────────────────────────
export type WelcomeMessageFeature = {
  enabled?:     boolean;
  channel?:     string;
  message?:     string;
  embedColor?:  string;
  embedTitle?:  string;
  showAvatar?:  boolean;
  autodelete?:  number;   // seconds, 0 = never
  dmMessage?:   string;
};

// ── GOODBYE ──────────────────────────────────────────────────
export type GoodbyeFeature = {
  enabled?:    boolean;
  channel?:    string;
  message?:    string;
  embedColor?: string;
  autodelete?: number;
};

// ── MEME ─────────────────────────────────────────────────────
export const memeFeatureSchema = z.object({
  channel: z.string().optional(),
  source:  z.enum(['youtube', 'twitter', 'discord']).optional(),
});
export type MemeFeature = z.infer<typeof memeFeatureSchema>;

// ── REACTION ROLES ───────────────────────────────────────────
export type ReactionRoleFeature = {
  roles?: { emoji: string; role: string; channel: string; messageId: string }[];
};

// ── MUSIC ─────────────────────────────────────────────────────
export type MusicFeature = {
  dj_role?:     string;
  volume?:      number;
  always_on?:   boolean;
  announce_ch?: string;
};

// ── MODERATION ────────────────────────────────────────────────
export type ModerationFeature = {
  enabled?:        boolean;
  log_channel?:    string;
  mute_role?:      string;
  auto_slowmode?:  boolean;
  warn_threshold?: number;
  warn_action?:    'mute' | 'kick' | 'ban';
};

// ── ANTINUKE ──────────────────────────────────────────────────
export type AntinukeFeature = {
  enabled?:      boolean;
  punishment?:   'ban' | 'kick' | 'strip';
  whitelisted?:  string[];
  antiban?:      boolean;
  antikick?:     boolean;
  antichannel?:  boolean;
  antirole?:     boolean;
  antiwebhook?:  boolean;
  antibot?:      boolean;
  antiprune?:    boolean;
  antieveryone?: boolean;
};

// ── AUTOMOD ───────────────────────────────────────────────────
export type AutomodFeature = {
  enabled?:        boolean;
  antilink?:       boolean;
  antilink_whitelist?: string[];
  antispam?:       boolean;
  antispam_limit?: number;
  anticaps?:       boolean;
  anticaps_pct?:   number;
  antiemoji?:      boolean;
  antiemoji_limit?:number;
  antimention?:    boolean;
  antimention_limit?: number;
  punishment?:     'warn' | 'mute' | 'kick' | 'ban';
  log_channel?:    string;
};

// ── LEVELS ────────────────────────────────────────────────────
export type LevelsFeature = {
  enabled?:      boolean;
  announce_ch?:  string;
  base_msgs?:    number;
  base_reward?:  number;
  msg_income?:   number;
  level_roles?:  { level: number; role: string }[];
};

// ── LOGGING ───────────────────────────────────────────────────
export type LoggingFeature = {
  enabled?:     boolean;
  member_log?:  string;
  message_log?: string;
  mod_log?:     string;
  voice_log?:   string;
  server_log?:  string;
  invite_log?:  string;
  join_log?:    string;
  leave_log?:   string;
};

// ── VOICEMASTER ───────────────────────────────────────────────
export type VoicemasterFeature = {
  enabled?:       boolean;
  category?:      string;
  create_ch?:     string;
  default_limit?: number;
  default_name?:  string;
};

// ── TRACKER ───────────────────────────────────────────────────
export type TrackerFeature = {
  enabled?:         boolean;
  blacklisted_chs?: string[];
  track_invites?:   boolean;
  track_messages?:  boolean;
};

// ── AUTOREACT ─────────────────────────────────────────────────
export type AutoreactFeature = {
  reactions?: {
    id:      number;
    channel: string;
    emoji:   string;
    trigger: string;
  }[];
};

// ── ROLES ─────────────────────────────────────────────────────
export type RolesFeature = {
  auto_roles?:  string[];
  mute_role?:   string;
  dj_role?:     string;
  bot_role?:    string;
};

// ── ECONOMY ───────────────────────────────────────────────────
export type EconomyFeature = {
  enabled?:       boolean;
  currency_name?: string;
  currency_emoji?:string;
  daily_amount?:  number;
  weekly_amount?: number;
  work_min?:      number;
  work_max?:      number;
  rob_enabled?:   boolean;
  shop_enabled?:  boolean;
  items?: {
    id:     string;
    name:   string;
    price:  number;
    role?:  string;
    desc?:  string;
  }[];
};

// ── TICKETS ───────────────────────────────────────────────────
export type TicketsFeature = {
  enabled?:        boolean;
  category?:       string;
  support_role?:   string;
  log_channel?:    string;
  open_message?:   string;
  max_open?:       number;
};

// ── GIVEAWAYS ─────────────────────────────────────────────────
export type GiveawaysFeature = {
  enabled?:         boolean;
  manager_role?:    string;
  bypass_role?:     string;
  default_channel?: string;
};
