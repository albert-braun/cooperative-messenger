# Nexus

GitHub хранит **код**, а не запущенный сайт. Next.js с API нельзя открыть как страницу прямо из репозитория.

**Чтобы открыть мессенджер в браузере**, один раз задеплой на Vercel (вход через GitHub):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/albert-braun/cooperative-messenger)

После деплоя Vercel даст ссылку вида `https://cooperative-messenger-….vercel.app`. Её можно вставить в CV как live demo.

Корпоративный мессенджер в стиле Slack: три колонки, тёмная тема, mock-данные и полноценный продуктовый каркас — не лендинг и не магазин.

## Стек

- **Next.js 16** (App Router, SSR, metadata, `robots` / `sitemap`)
- **React 19 + TypeScript**
- **Tailwind CSS 4**
- **TanStack Query** — серверное состояние, infinite messages, optimistic send, retry/error
- **Zustand** — UI: активный воркспейс/канал, мобильная навигация, черновики
- **Vitest + Testing Library** — unit/integration
- **Playwright** — E2E: логин → отправка сообщения

## Что показывает проект (для CV)

| Тема | Где смотреть |
| --- | --- |
| Реальный API | `src/app/api/**` |
| Auth / roles / permissions | cookie-сессия, admin / member / guest, `src/features/auth/permissions.ts` |
| Async-state и error handling | Query + `error.tsx` + Retry banners |
| Architecture | `entities` / `features` / `shared` / `server` / `store` |
| Accessibility | landmarks, `aria-*`, skip-link, Escape, focusable composer |
| Performance | пагинация сообщений, `memo`, `content-visibility` |
| SEO | SSR лендинг, Open Graph, noindex для `/app` |
| Безопасность клиента | sanitize HTML, origin check, HttpOnly cookie, security headers |
| Баги после релиза | optimistic rollback, error boundary, 403 для guest |

## Запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

Демо-аккаунты (пароль `nexus-demo`):

- `alex@nexus.dev` — Admin
- `maya@nexus.dev` — Member
- `guest@nexus.dev` — Guest (только чтение)

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

## Интерфейс

1. Узкий rail — воркспейсы и профиль
2. Сайдбар — `#general`, `#random`, Direct Messages со статусами online/away/offline
3. Чат — шапка канала, бесконечная лента вверх, кастомный composer внизу

На мобильных сайдбары складываются в drawer (кнопка меню в шапке).
