import type { Role } from "@/entities/types";

export function canSendMessage(role: Role) {
  return role === "admin" || role === "member";
}

export function canDeleteMessage(role: Role, isOwn: boolean) {
  if (role === "admin") return true;
  if (role === "member" && isOwn) return true;
  return false;
}

export function canCreateChannel(role: Role) {
  return role === "admin";
}

export function roleLabel(role: Role) {
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return "Guest";
}
