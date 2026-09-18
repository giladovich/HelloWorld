# Todo App — Design Spec

## Purpose

A client-side todo list app used as a vehicle to exercise a full E2E-tested
CI/CD pipeline on a free GitHub account: React app, Playwright E2E tests
running in GitHub Actions, and automated deployment to GitHub Pages gated
on those tests passing.

## Scope decisions

- **Persistence**: `localStorage` only. No backend, no database, no
  multi-device sync. Single-user, single-browser.
- **Feature richness**: "Rich" tier — add/edit/complete/delete, filter
  (All/Active/Completed + category), search, categories/tags, priorities,
  due dates, drag-to-reorder.
- **Location**: new `todo-app/` subfolder inside the existing `HelloWorld`
  repo (`github.com/giladovich/HelloWorld`). The existing `main.py` and
  `README.md` at repo root are untouched.
- **Stack**: React + Vite (TypeScript).
- **E2E tool**: Playwright, run against the built app via `vite preview`
  (not the dev server).
- **CI triggers**: tests run on every push (any branch) and on PRs
  targeting `main`. Deployment runs only on push to `main`, and only
  after tests pass.

## Repo layout

```
HelloWorld/
├── main.py, README.md          (existing, untouched)
├── todo-app/
│   ├── src/
│   │   ├── components/         (TodoList, TodoItem, AddTodoForm, FilterBar, SearchBar, CategoryFilter)
│   │   ├── hooks/               (useTodos — localStorage-backed CRUD state)
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── e2e/                     (Playwright specs)
│   ├── vite.config.ts
│   ├── playwright.config.ts
│   └── package.json
└── .github/workflows/
    └── ci.yml                   (test job + gated deploy job)
```

Single-page app, no router. All state lives in one `useTodos` hook backed
by `localStorage`; no external state library.

Deployed via the `gh-pages` branch / GitHub Pages, so the live URL is
`https://giladovich.github.io/HelloWorld/`, independent of the `todo-app/`
source subfolder location. Vite `base` is configured accordingly.

## Data model

```ts
type Priority = 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string | null;   // free-text tag, e.g. "work"
  priority: Priority;
  dueDate: string | null;    // ISO date
  order: number;             // for drag-reorder
  createdAt: string;
}
```

## Features

- **Add**: text required; category, priority, due date optional (default
  priority `medium`).
- **Edit**: inline edit of text/category/priority/due date.
- **Complete/uncomplete**: checkbox toggle.
- **Delete**: inline "Undo" toast rather than a confirm modal — simpler
  and more testable.
- **Filter**: All / Active / Completed, plus a category dropdown derived
  from existing categories in use.
- **Search**: live text filter on task title.
- **Drag-to-reorder**: native HTML5 drag-and-drop within the current
  filtered view; persists via the `order` field.
- **Priority**: visual indicator (color/label). Default sort is by
  `order`, not priority.

## Error handling

Minimal by design — everything is local. The only real failure mode is
`localStorage` being unavailable or full (e.g., private browsing). The
app catches that and falls back to in-memory state for the session, with
a small non-blocking banner noting changes won't persist.

## Testing strategy

Playwright, one spec file per feature area under `todo-app/e2e/`, run
against the `vite preview` build:

- `add-todo.spec.ts` — add a task, appears in list, persists after reload
- `complete-delete.spec.ts` — toggle complete, delete with undo
- `edit.spec.ts` — inline edit updates text/category/priority/due date
- `filter-search.spec.ts` — All/Active/Completed filters, category
  filter, search narrows results
- `reorder.spec.ts` — drag-and-drop changes order, persists after reload
- `empty-state.spec.ts` — fresh load with no todos shows an empty-state
  message

Each test clears `localStorage` before running (e.g. via
`page.addInitScript`) so tests are independent and order-agnostic.
Chromium only for now; Firefox/WebKit can be added later if desired.

## CI/CD pipeline

Single workflow file `.github/workflows/ci.yml`:

- **`test` job** (always runs, on push to any branch and PRs to `main`):
  checkout, setup Node, `npm ci` in `todo-app/`, `npx playwright install
  --with-deps chromium`, `npm run build`, `npm run test:e2e`. Uploads the
  Playwright HTML report as an artifact on failure.
- **`deploy` job** (`needs: test`, runs only on push to `main`): builds
  the production bundle and publishes it via `actions/deploy-pages`
  (GitHub's official action — no PAT needed) to GitHub Pages.

This demonstrates a real CI/CD gate: deployment only happens if E2E tests
pass.

## Out of scope

- Multi-user support, accounts, or any backend/database.
- Cross-device sync.
- Non-Chromium E2E browser coverage (can be added later).
- Router/multi-page navigation.
