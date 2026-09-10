export type Role = "admin" | "member" | "guest";
export type Presence = "online" | "away" | "offline";
export type ChannelKind = "channel" | "dm";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  presence: Presence;
  title: string;
  initials: string;
  accent: string;
};

export type Workspace = {
  id: string;
  name: string;
  short: string;
  accent: string;
};

export type Channel = {
  id: string;
  workspaceId: string;
  kind: ChannelKind;
  name: string;
  topic: string;
  unread: number;
  memberIds: string[];
};

export type Message = {
  id: string;
  channelId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type SessionUser = Omit<User, "password">;

export type PageResult<T> = {
  items: T[];
  nextCursor: string | null;
};
