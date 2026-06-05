# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A boilerplate template collection for full-stack web apps. The working templates live under `boilerplate-template/` — the top-level `backend/` and `frontend/` directories are where the actual application is being built.

## Budget Application

A full budget management app using:
- **Backend:** `backend/dotnet/budget-api/` — ASP.NET Core 10 Web API, namespace `budget_api`, EF Core with SQL Server `(localdb)\MSSQLLocalDB`, database `BudgetApp`
- **Frontend:** `frontend/angular/budget-front/` — Angular 21.1 standalone components, lazy-loaded routes, Bootstrap 5.3.8

### Domain model

All user-owned entities carry a `UserId` string (FK to ASP.NET Identity `AspNetUsers.Id`) and all controller queries filter by `User.FindFirstValue(ClaimTypes.NameIdentifier)`.

| Entity | Key fields |
|--------|-----------|
| `Category` | Name, Type (Income/Expense), Color, Icon, UserId |
| `Transaction` | Date, Amount, Description, Type (Income/Expense/Investment), CategoryId, Notes, IsExecuted, UserId |
| `Budget` | CategoryId, Month, Year, TargetAmount, UserId |
| `Goal` | Name, Description, TargetAmount, CurrentAmount, Deadline, Status (Active/Completed/Paused), UserId |
| `RecurringTransaction` | Description, Amount, Type, CategoryId, DayOfMonth, Notes, IsActive, UserId |
| `Account` | Name, Amount, AccountType (Regular/Investment), LastModified (DateOnly, auto-set to today on save), UserId |
| `AccountHistory` | AccountId (FK), Date (DateOnly), Amount — one row per account per day, upserted on every Account create/update |
| `AppSettings` | CutoffDay (1–31), PastColor, TodayColor, FutureColor — singleton row, UserId |
| `Loan` | Name, LoanAmount, StartDate (DateOnly), InterestRate, MonthlyPayment, TermMonths, InsuranceAmount, CurrentBalance, GoalAmount (decimal?), GoalDate (DateOnly?), UserId |
| `Book` | Title, Author, TotalPages, CurrentPage, StartDate (DateOnly), Status ("Reading"/"Paused"/"Wishlist"/"Completed"), TargetDate (DateOnly?), Notes, BookType ("Technology"/"Literature"), UserId |
| `BookProgress` | BookId (FK, cascade delete), Date (DateOnly), CurrentPage — one row per book per day, upserted via POST `/api/books/{id}/progress` |
| `BookTask` | BookId (FK), Title, IsDone — lab tasks for Technology books only |
| `Vehicle` | Name, Make, Model, Year, CurrentMileage, LicensePlate, Color, Notes, UserId |

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
- `Controllers/` — one controller per entity plus `DashboardController` and `AuthController`; all entity controllers have `[Authorize]`
- `Program.cs` — registers DbContext, ASP.NET Core Identity (`AddIdentity<IdentityUser, IdentityRole>`), JWT Bearer auth, CORS (allows any origin), OpenAPI (dev only)
- `Migrations/` — EF Core migration history

**Controller routing:** Multi-word controllers use a hardcoded kebab-case `[Route]` attribute (e.g., `[Route("api/recurring-transactions")]`), not `[controller]`.

**API endpoints:**

| Controller | Route | Notable extras |
|---|---|---|
| AuthController | `api/auth` | POST `/register` (email, password, displayName → JWT); POST `/login` (email, password → JWT); GET `/me` (requires auth) |
| CategoriesController | `api/categories` | |
| TransactionsController | `api/transactions` | GET: `?categoryId`, `?type`, `?month`, `?year` — when month+year provided, filters by billing period; DELETE (no id) bulk-deletes with same filters; POST `/import` bulk-creates from CSV rows |
| BudgetsController | `api/budgets` | GET: `?month`, `?year` |
| GoalsController | `api/goals` | |
| RecurringTransactionsController | `api/recurring-transactions` | Sorted by DayOfMonth; POST `/generate?month=&year=` creates transactions from active templates, splitting by CutoffDay |
| AccountsController | `api/accounts` | GET `/{id}/history` returns last 6 months of AccountHistory ordered by date |
| LoansController | `api/loans` | Ordered by Name |
| BooksController | `api/books` | Ordered Reading→Paused→Wishlist→Completed then by Title (in-memory sort); GET `/{id}/progress` returns full BookProgress history; POST `/{id}/progress` upserts today's entry and updates Book.CurrentPage; GET/POST `/{id}/tasks`, PUT/DELETE `/{id}/tasks/{taskId}` — lab task CRUD |
| VehiclesController | `api/vehicles` | Ordered by Name |
| AppSettingsController | `api/app-settings` | Singleton; GET auto-creates with defaults; PUT upserts |
| DashboardController | `api/dashboard/summary?month=&year=` | Returns totalIncome, totalExpense, netBalance, totalInvested, spendingByCategory, budgetVsActual, goals |
| DashboardController | `api/dashboard/trend?months=6` | Returns net balance per billing period for the last N months |

**Auth pattern in controllers:** Every entity controller declares `private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;` and all DB queries filter by `UserId == CurrentUserId`. On POST/PUT, the controller sets `entity.UserId = CurrentUserId` before saving.

**JWT config** (in `appsettings.Development.json`): `Jwt:Key`, `Jwt:Issuer` (`"budget-api"`), `Jwt:Audience` (`"budget-frontend"`), `Jwt:ExpiresInMinutes` (1440). Token carries `NameIdentifier`, `Email`, and `Name` claims.

**Billing period logic (used in Transactions, Dashboard, RecurringTransaction generate):**
- Period starts on `CutoffDay` of the selected month and ends the day before `CutoffDay` of the next month.
- `GetPeriod(cutoffDay, month, year)` is a private static helper duplicated in both `TransactionsController` and `DashboardController`.

**Transaction ordering:** `OrderByDescending(IsExecuted).ThenBy(Date)` — executed rows sort first by date ascending, non-executed rows appear below.

**RecurringTransaction generate split rule:** If `DayOfMonth >= CutoffDay`, the transaction lands in the selected month; if `DayOfMonth < CutoffDay`, it lands in the next month.

### Frontend (`frontend/angular/budget-front/src/app/`)

All components are standalone; routes use `loadComponent` for lazy loading. No NgModules.

**Directory layout:**
- `views/` — one subfolder per feature: `dashboard`, `transactions`, `categories`, `budgets`, `goals`, `recurring-transactions`, `accounts`, `loans`, `books`, `settings`
- `layouts/` — `MainLayout` (root shell with `<router-outlet>`), `VerticalLayout` (sidebar + topbar + content + footer), `Sidenav`, `Topbar`, `Footer`
- `core/services/api/` — one service per entity plus `DashboardService`; all use `HttpClient` with `API_BASE = 'http://localhost:5082'` from `constants/index.ts`
- `core/services/auth.service.ts` — JWT stored in `localStorage` under `budget_token`; exposes `login()`, `register()`, `logout()`, `isLoggedIn`, `userEmail`, `userName`
- `core/interceptors/auth.interceptor.ts` — `HttpInterceptorFn` that injects `Authorization: Bearer <token>` on every request
- `core/interceptors/api-url.interceptor.ts` — rewrites `API_BASE` for PWA/mobile dynamic base URL
- `core/guards/auth.guard.ts` — redirects unauthenticated users to `/login`
- `core/services/layout.service.ts` — implements `CanActivate`; manages theme and sidenav state via Angular signals, persisted to `sessionStorage`
- `constants/index.ts` — `API_BASE` URL and `menuItems` array (sidebar nav links); add new pages here

**Routing:** `/login` is a standalone route (no `MainLayout`). All feature routes are children of `MainLayout`, guarded by both `LayoutService` and `authGuard`. The wildcard `**` redirects to `/login`.

**Adding a new page** requires three things: a component in `views/<feature>/`, a route entry in `app.routes.ts` (as a child of `MainLayout`), and a menu entry in `constants/index.ts`.

**View component conventions:**
- Self-contained: inline template, no separate HTML file.
- Modals rendered inline with `@if (showModal)` — no Bootstrap JS or ng-bootstrap modal service.
- Pattern: `showModal` boolean + `form` object reset by `openForm(item?)` / `closeForm()`.
- Template control flow: Angular 17+ block syntax (`@if`, `@for`, `@empty`) — not `*ngIf` / `*ngFor`.

**UI stack:** Bootstrap 5.3.8, Iconify icons (`iconify-icon` web component with `tabler:icon-name`; requires `CUSTOM_ELEMENTS_SCHEMA`), ApexCharts (`ng-apexcharts`; import `NgApexchartsModule` + individual Apex types), ng-bootstrap.

**Styles:** SCSS in `src/assets/scss/`; theme variables in `_variables.scss` and `_variables-dark.scss`; entry point `app.scss`.

**Path aliases** (configured in `tsconfig.json`): `@core/*`, `@layouts/*`, `@app/components/*`, `@/*`.

**Transaction date tags:** Past/Today badges shown on transaction rows when `IsExecuted` is false. Colors come from `AppSettings` (PastColor, TodayColor). No Future tag is shown.

### Integration tests (`backend/dotnet/budget-api.Tests/`)

Run with `dotnet test` from the solution root or from `backend/dotnet/`.

- `BudgetApiFactory` extends `WebApplicationFactory<Program>`, swaps SQL Server for `InMemoryDatabase`, and replaces JWT Bearer with `TestAuthHandler` (scheme name `"Test"`) so all requests are automatically authenticated as user id `TestAuthHandler.UserId` (`"test-user-id"`).
- `ResetDatabase()` wipes and recreates the in-memory DB between tests. `Seed<T>()` / `SeedMany<T>()` insert rows directly.
- When seeding entities that have `UserId`, set it to `TestAuthHandler.UserId` so they pass controller-level ownership filters.
- Test classes use `IClassFixture<BudgetApiFactory>` and call `factory.ResetDatabase()` in the constructor.

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
