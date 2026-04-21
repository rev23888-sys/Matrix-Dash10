# Matrix Bot Dashboard

A full-featured Discord bot dashboard built with **Next.js** and **Chakra UI**.

---

## 🚀 Quick Setup

### 1. Copy `.env.example` → `.env`
```bash
cp .env.example .env
```
Fill in these values:

| Variable | Where to get it |
|---|---|
| `BOT_CLIENT_ID` | [Discord Dev Portal](https://discord.com/developers/applications) → OAuth2 |
| `BOT_CLIENT_SECRET` | Same page as above |
| `APP_URL` | `http://localhost:3000` for local, your domain for production |
| `NEXT_PUBLIC_API_ENDPOINT` | Your bot's HTTP API URL (e.g. `http://localhost:8080`) |
| `SESSION_SECRET` | Any long random string |

### 2. Add Redirect URI in Discord Dev Portal
Go to: **OAuth2 → Redirects** → Add:
```
http://localhost:3000/api/auth/callback
```
For production replace `localhost:3000` with your domain.

### 3. Install & Run
```bash
pnpm install
pnpm dev       # development
pnpm build     # production build
pnpm start     # start production
```

---

## 🔗 Where to Change Links

All external links are defined in **one place** each:

| Link | File | Variable |
|---|---|---|
| **Invite Bot** | `src/config/common.tsx` | `inviteUrl` |
| **Invite Bot** | `src/config/example/HomeView.tsx` | `INVITE_URL` |
| **Support Server** | `src/config/example/HomeView.tsx` | `SUPPORT_URL` |
| **Top.gg Vote** | `src/config/example/HomeView.tsx` | `VOTE_URL` |
| **Top.gg Vote** | `src/components/layout/sidebar/SidebarContent.tsx` | `VOTE_URL` |
| **Commands page** | `src/config/example/HomeView.tsx` | `COMMANDS_URL` |

To change all at once, search for `tinyurl.com/Invite-Matrix` across the codebase and replace.

---

## 🐛 Bugs Fixed in This Version

### Bug 1 — Servers not showing after login
**Cause:** The OAuth2 login was using scope `identify guilds` only. Discord requires `guilds.members.read` to correctly return the `owner` field and full permission data for the user's guilds.

**Fixed in:** `src/pages/api/auth/login.ts` — scope updated to `identify guilds guilds.members.read`

### Bug 2 — Home page showed HomeView placeholder instead of real guild list
**Cause:** `home.tsx` had two `return` statements — the first (`return <HomeView />`) prevented `return <GuildSelect />` from ever executing.

**Fixed in:** `src/pages/user/home.tsx` — restructured so `HomeView` renders AND calls `GuildSelect` inside it.

### Bug 3 — No distinction between owned and admin servers
**Fixed:** Servers are now split into **"Your Servers"** (owner) and **"Admin Servers"** sections, both in the sidebar and on the home page.

### Bug 4 — No "Invite Bot" / "Manage Server" buttons
**Fixed:** Each server card now shows:
- **Invite Bot** — links to Discord OAuth2 with `guild_id` pre-filled
- **Manage** — links to `/guilds/{id}` dashboard page

---

## 📁 Key Files

```
src/
├── pages/
│   ├── user/home.tsx              ← Main home page + GuildSelect
│   ├── api/auth/login.ts          ← OAuth2 login (scope fixed here)
│   ├── api/auth/callback.ts       ← OAuth2 callback
│   └── guilds/[guild]/
│       ├── index.tsx              ← Guild features page
│       └── settings.tsx           ← Guild settings
├── config/
│   ├── common.tsx                 ← Bot name, invite URL, guild filter
│   ├── features.tsx               ← All bot features listed here
│   └── example/HomeView.tsx       ← Dashboard home layout
├── components/
│   └── layout/sidebar/
│       └── SidebarContent.tsx     ← Sidebar + hamburger menu
└── .env.example                   ← All required env vars explained
```
