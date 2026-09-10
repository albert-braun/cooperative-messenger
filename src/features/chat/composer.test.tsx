import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Composer } from "@/features/chat/composer";

function renderComposer() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <Composer
        channel={{
          id: "ch-general",
          workspaceId: "ws-hq",
          kind: "channel",
          name: "general",
          topic: "Company-wide",
          unread: 0,
          memberIds: ["u-sam"],
        }}
        currentUser={{
          id: "u-sam",
          name: "Sam Guest",
          email: "guest@nexus.dev",
          role: "guest",
          presence: "online",
          title: "External contractor",
          initials: "SG",
          accent: "#8b93a7",
        }}
      />
    </QueryClientProvider>,
  );
}

describe("Composer", () => {
  it("locks the input for guest users", () => {
    renderComposer();
    expect(screen.getByLabelText("Message")).toBeDisabled();
    expect(
      screen.getByPlaceholderText("Guest accounts are read-only"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
