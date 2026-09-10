import { describe, expect, it } from "vitest";
import { sanitizeMessage, unescapePreview } from "@/shared/lib/sanitize";

describe("sanitizeMessage", () => {
  it("strips HTML tags and escapes leftovers", () => {
    expect(sanitizeMessage('<img src=x onerror="alert(1)">hi')).toBe("hi");
    expect(sanitizeMessage("a < b")).toBe("a &lt; b");
  });

  it("trims, drops control characters, and respects the max length", () => {
    expect(sanitizeMessage("  hello\u0007  ")).toBe("hello");
    expect(sanitizeMessage("x".repeat(12), 8)).toBe("xxxxxxxx");
  });

  it("round-trips escaped text for display", () => {
    expect(unescapePreview(sanitizeMessage('say "hi"'))).toBe('say "hi"');
  });
});
