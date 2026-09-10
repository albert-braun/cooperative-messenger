import { describe, expect, it } from "vitest";
import {
  canCreateChannel,
  canDeleteMessage,
  canSendMessage,
} from "@/features/auth/permissions";

describe("permissions", () => {
  it("lets members and admins send messages, but not guests", () => {
    expect(canSendMessage("admin")).toBe(true);
    expect(canSendMessage("member")).toBe(true);
    expect(canSendMessage("guest")).toBe(false);
  });

  it("lets admins delete any message and members delete their own", () => {
    expect(canDeleteMessage("admin", false)).toBe(true);
    expect(canDeleteMessage("member", true)).toBe(true);
    expect(canDeleteMessage("member", false)).toBe(false);
    expect(canDeleteMessage("guest", true)).toBe(false);
  });

  it("restricts channel creation to admins", () => {
    expect(canCreateChannel("admin")).toBe(true);
    expect(canCreateChannel("member")).toBe(false);
  });
});
