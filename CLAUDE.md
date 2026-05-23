# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A boilerplate template collection for full-stack web apps. The working templates live under `boilerplate-template/` — the top-level `backend/` and `frontend/` directories are where the actual application is being built.

## Budget Application

A full budget management app using:
- **Backend:** `backend/dotnet/budget-api/` — ASP.NET Core 10 Web API, namespace `budget_api`, EF Core with SQL Server `(localdb)\MSSQLLocalDB`, database `BudgetApp`
- **Frontend:** `frontend/angular/budget-front/` — Angular 21.1 standalone components, lazy-loaded routes, Bootstrap 5.3.8

### Domain model

| Entity | Key fields |
|--------|-----------|
| `Category` | Name, Type (Income/Expense), Color, Icon |
| `Transaction` | Date, Amount, Description, Type (Income/Expense), CategoryId, Notes, IsExecuted |
| `Budget` | CategoryId, Month, Year, TargetAmount |
| `Goal` | Name, Description, TargetAmount, CurrentAmount, Deadline, Status (Active/Completed/Paused) |
| `RecurringTransaction` | Description, Amount, Type, CategoryId, DayOfMonth, Notes, IsActive |
| `Account` | Name, Amount, LastModified (DateOnly, auto-set to today on save) |
| `AccountHistory` | AccountId (FK), Date (DateOnly), Amount — one row per account per day, upserted on every Account create/update |
| `AppSettings` | CutoffDay (1–31), PastColor, TodayColor, FutureColor — singleton row |

### Connection string

```
Server=(localdb)\MSSQLLocalDB;Database=BudgetApp;Trusted_Connection=True;TrustServerCertificate=True;
```

### Backend commands (run from `backend/dotnet/budget-api/`)

```bash
dotnet build
dotnet run                          # API at https://localhost:7146 / http://localhost:5082
dotnet ef migrations add <Name>     # requires: dotnet tool install -g dotnet-ef
dotnet ef database update
```

`budget-api.http` in the project root contains ready-made REST client requests for manual testing.

### Frontend commands (run from `frontend/angular/budget-front/`)

```bash
npm install
ng serve        # dev server at http://localhost:4200
ng build
ng test
ng test --include=src/app/path/to/file.spec.ts   # single file
```

## Architecture

### Backend (`backend/dotnet/budget-api/`)

- `Models/` — EF Core entity classes (one file per entity)
- `Data/BudgetDbContext.cs` — DbContext; all decimal fields use precision (18,2)
- `Controllers/` — one controller per entity plus `DashboardController`
- `Program.cs` — minimal hosting model; registers DbContext, CORS (allows `http://localhost:4200`), OpenAPI (dev only)
- `Migrations/` — EF Core migration history

**Controller routing:** Multi-word controllers use a hardcoded kebab-case `[Route]` attribute (e.g., `[Route("api/recurring-transactions")]`), not `[controller]`.

**API endpoints:**

| Controller | Route | Notable extras |
|---|---|---|
| CategoriesController | `api/categories` | |
| TransactionsController | `api/transactions` | GET: `?categoryId`, `?type`, `?month`, `?year` — when month+year provided, filters by billing period; DELETE (no id) bulk-deletes with same filters; POST `/import` bulk-creates from CSV rows |
| BudgetsController | `api/budgets` | GET: `?month`, `?year` |
| GoalsController | `api/goals` | |
| RecurringTransactionsController | `api/recurring-transactions` | Sorted by DayOfMonth; POST `/generate?month=&year=` creates transactions from active templates, splitting by CutoffDay |
| AccountsController | `api/accounts` | GET `/{id}/history` returns last 6 months of AccountHistory ordered by date |
| AppSettingsController | `api/app-settings` | Singleton; GET auto-creates with defaults; PUT upserts |
| DashboardController | `api/dashboard/summary?month=&year=` | Returns totalIncome, totalExpense, netBalance, spendingByCategory, budgetVsActual, goals |
| DashboardController | `api/dashboard/trend?months=6` | Returns income/expense per billing period for the last N months |

**Billing period logic (used in Transactions, Dashboard, RecurringTransaction generate):**
- Period starts on `CutoffDay` of the selected month and ends the day before `CutoffDay` of the next month.
- `GetPeriod(cutoffDay, month, year)` is a private static helper duplicated in both `TransactionsController` and `DashboardController`.

**Transaction ordering:** `OrderByDescending(IsExecuted).ThenBy(Date)` — executed rows sort first by date ascending, non-executed rows appear below.

**RecurringTransaction generate split rule:** If `DayOfMonth >= CutoffDay`, the transaction lands in the selected month; if `DayOfMonth < CutoffDay`, it lands in the next month.

### Frontend (`frontend/angular/budget-front/src/app/`)

All components are standalone; routes use `loadComponent` for lazy loading. No NgModules.

**Directory layout:**
- `views/` — one subfolder per feature: `dashboard`, `transactions`, `categories`, `budgets`, `goals`, `recurring-transactions`, `accounts`, `settings`
- `layouts/` — `MainLayout` (root shell with `<router-outlet>`), `VerticalLayout` (sidebar + topbar + content + footer), `Sidenav`, `Topbar`, `Footer`
- `core/services/api/` — one service per entity plus `DashboardService`; all use `HttpClient` with `API_BASE = 'http://localhost:5082'` from `constants/index.ts`
- `core/services/layout.service.ts` — implements `CanActivate`; manages theme and sidenav state via Angular signals, persisted to `sessionStorage`
- `constants/index.ts` — `API_BASE` URL and `menuItems` array (sidebar nav links); add new pages here

**Routing:** All feature routes are children of `MainLayout`, guarded only by `LayoutService`. The wildcard `**` redirects to `dashboard`.

**Adding a new page** requires three things: a component in `views/<feature>/`, a route entry in `app.routes.ts`, and a menu entry in `constants/index.ts`.

**View component conventions:**
- Self-contained: inline template, no separate HTML file.
- Modals rendered inline with `@if (showModal)` — no Bootstrap JS or ng-bootstrap modal service.
- Pattern: `showModal` boolean + `form` object reset by `openForm(item?)` / `closeForm()`.
- Template control flow: Angular 17+ block syntax (`@if`, `@for`, `@empty`) — not `*ngIf` / `*ngFor`.

**UI stack:** Bootstrap 5.3.8, Iconify icons (`iconify-icon` web component with `tabler:icon-name`; requires `CUSTOM_ELEMENTS_SCHEMA`), ApexCharts (`ng-apexcharts`; import `NgApexchartsModule` + individual Apex types), ng-bootstrap.

**Styles:** SCSS in `src/assets/scss/`; theme variables in `_variables.scss` and `_variables-dark.scss`; entry point `app.scss`.

**Path aliases** (configured in `tsconfig.json`): `@core/*`, `@layouts/*`, `@app/components/*`, `@/*`.

**Transaction date tags:** Past/Today badges shown on transaction rows when `IsExecuted` is false. Colors come from `AppSettings` (PastColor, TodayColor). No Future tag is shown.

## Template Variants (reference only)

| Path | Stack |
|------|-------|
| `boilerplate-template/Angular/Admin/` | Angular 21.1, full Inspinia admin dashboard |
| `boilerplate-template/Angular/StarterKit/` | Angular 21.1, minimal starter |
| `boilerplate-template/ASP.Net Core MVC/Inspinia/` | .NET 10 MVC, full Inspinia admin dashboard |
| `boilerplate-template/ASP.Net Core MVC/Starterkit/` | .NET 10 MVC, minimal starter |
| `boilerplate-template/ASP.Net Core10x/Inspinia/` | .NET 10 (non-MVC), full dashboard |
| `boilerplate-template/ASP.Net Core10x/Starterkit/` | .NET 10 (non-MVC), minimal starter |

HTML documentation for the Inspinia theme: `boilerplate-template/Angular/Docs/index.html` and `boilerplate-template/ASP.Net Core MVC/Docs/index.html`.
