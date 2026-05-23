# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
ng serve                                        # dev server at http://localhost:4200
ng build                                        # production build to dist/budget-front/
ng test                                         # Karma/Jasmine test runner
ng test --include=src/app/path/to/file.spec.ts  # run a single test file
```

## Architecture

Angular 21 **standalone components only** — no NgModules anywhere. All components use `imports: [...]` directly on the decorator.

### Routing

`app.routes.ts` has a single route tree: everything under `''` renders inside `MainLayout`, guarded by `LayoutService`. All feature routes lazy-load via `loadComponent`. Adding a new page requires:
1. A new component in `src/app/views/<feature>/`
2. A route entry in `app.routes.ts`
3. A menu entry in `src/app/constants/index.ts` (`menuItems` array)

### Layout

`MainLayout` → `VerticalLayout` → `Sidenav + Topbar + (router-outlet) + Footer`

`VerticalLayout` listens for window resize and calls `LayoutService.updateLayout({ sidenavSize })` to switch between `default` (>1140 px), `condensed` (768–1140 px), and `offcanvas` (<768 px). The sidenav CSS and theme are driven entirely by HTML data attributes set by `LayoutService.applyAttributes()`: `data-bs-theme`, `data-sidenav-size`, `data-menu-color`, etc.

### LayoutService

Lives at `src/app/core/services/layout.service.ts`. Dual role:
- **Route guard** (`CanActivate`) — re-applies layout attributes on every navigation
- **State manager** — holds an Angular `signal<LayoutState>` persisted to `sessionStorage` under key `__BUDGET_THEME__`

Call `layout.updateLayout({ theme, sidenavSize })` to change any layout attribute. `toggleTheme()` and `toggleMobileMenu()` are convenience wrappers.

### API Services

All in `src/app/core/services/api/`. Each file exports its TypeScript interface(s) and a `@Injectable({ providedIn: 'root' })` service backed by `HttpClient`. The base URL `http://localhost:5082` is the constant `API_BASE` in `src/app/constants/index.ts`.

| Service | Endpoint |
|---|---|
| `DashboardService` | `GET /api/dashboard/summary?month=&year=` |
| `TransactionService` | `GET/POST/PUT/DELETE /api/transactions` |
| `CategoryService` | `GET/POST/PUT/DELETE /api/categories` |
| `BudgetService` | `GET/POST/PUT/DELETE /api/budgets` |
| `GoalService` | `GET/POST/PUT/DELETE /api/goals` |

### View components

Each view (`src/app/views/<feature>/<feature>.ts`) is self-contained: inline template, no separate HTML file. Modals are rendered inline with `@if (showModal)` — no Bootstrap JS or `ng-bootstrap` modal service. The pattern is `showModal` boolean + `form` object reset by `openForm(item?)` / `closeForm()`.

### Styles

Entry point: `src/assets/scss/app.scss`. Imports Bootstrap SCSS first, then Inspinia theme partials (structure, components, plugins). Theme variables live in `_variables.scss` and `_variables-dark.scss`. Component styles belong in the SCSS partials, not in component `styles` arrays.

### Key conventions

- **Path aliases** (configured in `tsconfig.json`): `@core/*` → `src/app/core/*`, `@layouts/*` → `src/app/layouts/*`, `@app/components/*` → `src/app/components/*`, `@/*` → `src/*`
- **Icons**: `iconify-icon` web component with Tabler icons (`tabler:icon-name`). Components using it must include `CUSTOM_ELEMENTS_SCHEMA` and `iconify-icon` does not need to be in `imports`.
- **Charts**: `ng-apexcharts` (`NgApexchartsModule`). Import `ApexChart`, `ApexNonAxisChartSeries`, etc. directly from `ng-apexcharts`.
- **Template control flow**: use Angular 17+ block syntax (`@if`, `@for`, `@empty`) — not `*ngIf` / `*ngFor`.
