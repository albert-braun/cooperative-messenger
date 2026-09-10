import type {
  Channel,
  Message,
  SessionUser,
  User,
  Workspace,
} from "@/entities/types";

const users: User[] = [
  {
    id: "u-alex",
    name: "Alex Rivera",
    email: "alex@nexus.dev",
    password: "nexus-demo",
    role: "admin",
    presence: "online",
    title: "Engineering lead",
    initials: "AR",
    accent: "#7c6cff",
  },
  {
    id: "u-maya",
    name: "Maya Chen",
    email: "maya@nexus.dev",
    password: "nexus-demo",
    role: "member",
    presence: "online",
    title: "Product designer",
    initials: "MC",
    accent: "#3ee0c5",
  },
  {
    id: "u-jordan",
    name: "Jordan Blake",
    email: "jordan@nexus.dev",
    password: "nexus-demo",
    role: "member",
    presence: "away",
    title: "Frontend engineer",
    initials: "JB",
    accent: "#f0b429",
  },
  {
    id: "u-priya",
    name: "Priya Nair",
    email: "priya@nexus.dev",
    password: "nexus-demo",
    role: "member",
    presence: "offline",
    title: "QA engineer",
    initials: "PN",
    accent: "#ff7ab8",
  },
  {
    id: "u-chris",
    name: "Chris Okonkwo",
    email: "chris@nexus.dev",
    password: "nexus-demo",
    role: "member",
    presence: "online",
    title: "Platform engineer",
    initials: "CO",
    accent: "#5b9dff",
  },
  {
    id: "u-elena",
    name: "Elena Volkova",
    email: "elena@nexus.dev",
    password: "nexus-demo",
    role: "member",
    presence: "offline",
    title: "Content lead",
    initials: "EV",
    accent: "#ff8a65",
  },
  {
    id: "u-sam",
    name: "Sam Guest",
    email: "guest@nexus.dev",
    password: "nexus-demo",
    role: "guest",
    presence: "online",
    title: "External contractor",
    initials: "SG",
    accent: "#8b93a7",
  },
];

const workspaces: Workspace[] = [
  { id: "ws-hq", name: "Nexus HQ", short: "NX", accent: "#7c6cff" },
  { id: "ws-lab", name: "Design Lab", short: "DL", accent: "#3ee0c5" },
];

const channels: Channel[] = [
  {
    id: "ch-general",
    workspaceId: "ws-hq",
    kind: "channel",
    name: "general",
    topic: "Company-wide updates, launches, and wins",
    unread: 0,
    memberIds: users.map((user) => user.id),
  },
  {
    id: "ch-random",
    workspaceId: "ws-hq",
    kind: "channel",
    name: "random",
    topic: "Memes, coffee, and off-topic threads",
    unread: 3,
    memberIds: users.map((user) => user.id),
  },
  {
    id: "ch-eng",
    workspaceId: "ws-hq",
    kind: "channel",
    name: "engineering",
    topic: "Architecture, incidents, and reviews",
    unread: 1,
    memberIds: ["u-alex", "u-jordan", "u-chris", "u-priya", "u-sam"],
  },
  {
    id: "ch-design",
    workspaceId: "ws-lab",
    kind: "channel",
    name: "design",
    topic: "Figma files, critique, and design system",
    unread: 0,
    memberIds: ["u-maya", "u-elena", "u-alex", "u-jordan"],
  },
  {
    id: "dm-maya",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Maya Chen",
    topic: "Direct message",
    unread: 2,
    memberIds: ["u-alex", "u-maya"],
  },
  {
    id: "dm-jordan",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Jordan Blake",
    topic: "Direct message",
    unread: 0,
    memberIds: ["u-alex", "u-jordan"],
  },
  {
    id: "dm-priya",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Priya Nair",
    topic: "Direct message",
    unread: 0,
    memberIds: ["u-alex", "u-priya"],
  },
  {
    id: "dm-chris",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Chris Okonkwo",
    topic: "Direct message",
    unread: 0,
    memberIds: ["u-alex", "u-chris"],
  },
  {
    id: "dm-jordan-maya",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Jordan Blake",
    topic: "Direct message",
    unread: 0,
    memberIds: ["u-maya", "u-jordan"],
  },
  {
    id: "dm-priya-maya",
    workspaceId: "ws-hq",
    kind: "dm",
    name: "Priya Nair",
    topic: "Direct message",
    unread: 1,
    memberIds: ["u-maya", "u-priya"],
  },
];

const snippets: Record<string, string[]> = {
  "ch-general": [
    "Standup notes are in the doc. Shipping search filters today.",
    "Reminder: security review is at 16:00. Bring the auth flow diagram.",
    "New hire onboarding pack is ready — roles, permissions, and staging access.",
    "Can we keep #general for decisions and move jokes to #random?",
    "Incident from yesterday is closed. Root cause: stale React Query cache.",
    "Design QA passed on the composer. Keyboard send is Cmd/Ctrl + Enter.",
    "Guest accounts are read-only by design. Flag if a contractor needs write access.",
    "SSR landing page is indexed. App routes are noindex — as discussed.",
    "I'll add E2E coverage for login → send message after lunch.",
    "Dark theme contrast now meets AA on the sidebar and message list.",
  ],
  "ch-random": [
    "Who stole the last oat milk?",
    "This loading skeleton is weirdly satisfying.",
    "Unpopular opinion: infinite scroll is nicer than virtualization for chat.",
    "The new empty state illustration slaps.",
    "Coffee walk in 10?",
    "I named my local branch `fix/post-release-composer-overflow`.",
  ],
  "ch-eng": [
    "API latency is mocked at ~250ms so the async states are visible.",
    "DELETE /messages is admin or own-message only. Guests get 403.",
    "We should paginate with a cursor, not offset — less drift on inserts.",
    "Origin check is on all mutations. No CSRF via random sites.",
    "Zustand stays for UI chrome. Server state lives in TanStack Query.",
    "If HMR resets the in-memory store, just refresh — it's a demo DB.",
  ],
  "ch-design": [
    "Updated the rail to 72px and added presence rings.",
    "Mobile drawer uses a real dialog pattern: focus, Escape, backdrop.",
    "Composer should feel like a product, not a default textarea.",
    "I'll share the Figma file after the critique.",
  ],
  "dm-maya": [
    "The three-column layout holds up until 768px, then we collapse.",
    "Can you review the guest empty-composer copy?",
    "Looks good. Let's ship it.",
  ],
  "dm-jordan": [
    "Infinite query is wired. Scroll up to load older messages.",
    "Nice. I'll add the day dividers.",
  ],
  "dm-priya": [
    "Regression suite covers sanitize + permissions.",
    "I'll run Playwright after the UI lands.",
  ],
  "dm-chris": [
    "Security headers are in next.config.",
    "HttpOnly session cookie, SameSite=Lax.",
  ],
  "dm-jordan-maya": [
    "Infinite query is wired. Scroll up to load older messages.",
    "Looks solid on mobile too.",
  ],
  "dm-priya-maya": [
    "Permissions tests are green.",
    "I'll file the guest 403 case in the report.",
  ],
};

function seedChannelMessages(channelId: string, count: number): Message[] {
  const lines = snippets[channelId] ?? snippets["ch-general"];
  const authors = (channels.find((channel) => channel.id === channelId)?.memberIds ?? ["u-alex"]).filter(
    (id) => id !== "u-sam" || channelId === "ch-general",
  );
  const now = Date.now();
  return Array.from({ length: count }, (_, index) => {
    const createdAt = new Date(now - (count - index) * 1000 * 60 * 17).toISOString();
    return {
      id: `${channelId}-msg-${index + 1}`,
      channelId,
      authorId: authors[index % authors.length],
      body: lines[index % lines.length],
      createdAt,
    };
  });
}

const messages: Message[] = [
  ...seedChannelMessages("ch-general", 72),
  ...seedChannelMessages("ch-random", 28),
  ...seedChannelMessages("ch-eng", 36),
  ...seedChannelMessages("ch-design", 18),
  ...seedChannelMessages("dm-maya", 12),
  ...seedChannelMessages("dm-jordan", 8),
  ...seedChannelMessages("dm-priya", 6),
  ...seedChannelMessages("dm-chris", 6),
  ...seedChannelMessages("dm-jordan-maya", 8),
  ...seedChannelMessages("dm-priya-maya", 6),
];

type Database = {
  users: User[];
  workspaces: Workspace[];
  channels: Channel[];
  messages: Message[];
};

const globalStore = globalThis as typeof globalThis & {
  __nxDb?: Database;
  __nxDbVersion?: number;
};

function createDb(): Database {
  return {
    users: users.map((user) => ({ ...user })),
    workspaces: workspaces.map((workspace) => ({ ...workspace })),
    channels: channels.map((channel) => ({ ...channel })),
    messages: messages.map((message) => ({ ...message })),
  };
}

const DB_VERSION = 2;

if (!globalStore.__nxDb || globalStore.__nxDbVersion !== DB_VERSION) {
  globalStore.__nxDb = createDb();
  globalStore.__nxDbVersion = DB_VERSION;
}

export const db = globalStore.__nxDb;

export function toSessionUser(user: User): SessionUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function sleep(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
