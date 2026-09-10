import { LoginForm } from "@/features/auth/login-form";
import { StaticHomeRedirect } from "@/features/auth/static-home-redirect";

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <StaticHomeRedirect />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,124,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(62,224,197,0.12),transparent_28%)]"
      />
      <div className="relative mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--nx-accent-2)]">
            Next.js · TypeScript · TanStack Query · Zustand
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Nexus HQ
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-8 text-[#b7becf]">
            A corporate messenger with a slim workspace rail, channel sidebar,
            infinite chat, and a custom composer — built like a product, not a
            storefront clone.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-[#c9cfe0] sm:grid-cols-2">
            {[
              "Real route-handler API + auth cookies",
              "Roles: admin / member / guest",
              "Async state, retries, optimistic send",
              "SSR landing, noindex app shell",
              "Keyboard and screen-reader labels",
              "Unit tests for permissions & XSS sanitizing",
            ].map((item) => (
              <li key={item} className="rounded-xl border border-white/8 bg-white/4 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-white/10 bg-[#0e1118]/80 p-5 shadow-2xl backdrop-blur">
          <h2 className="mb-4 text-xl font-semibold">Enter a workspace</h2>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
