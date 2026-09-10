# Nexus

Slack-style **corporate messenger** for teams: switch workspaces, open channels and DMs, and chat in a dark three-column UI.

**[Live demo](https://albert-braun.github.io/cooperative-messenger/)**

## What it does

- **Workspace rail** — switch HQ / Design Lab, open your profile
- **Sidebar** — `#general`, `#random`, and Direct Messages with online / away / offline status
- **Chat** — channel header, infinite message history, custom composer (Enter to send)
- **Roles** — Admin (full access), Member (write + delete own messages), Guest (read-only)
- **Mobile** — sidebars collapse into a drawer

Mock users and messages are included so the app runs without a backend. Locally it also exposes a real Next.js API with cookie auth.

**Stack:** Next.js · TypeScript · Tailwind CSS · TanStack Query · Zustand

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Password for every demo account: `nexus-demo`

| Email | Role |
| --- | --- |
| `alex@nexus.dev` | Admin |
| `maya@nexus.dev` | Member |
| `guest@nexus.dev` | Guest |

```bash
npm test
```
