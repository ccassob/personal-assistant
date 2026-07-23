# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A boilerplate template collection for full-stack web apps. The working templates live under `boilerplate-template/` — the top-level `backend/` and `frontend/` directories are where the actual application is being built.

## Personal Assistant Application

A full personal-management app (budget, loans, vehicles, books, grocery, pantry, goals, credit cards) using:
- **Backend:** `backend/dotnet/personal-assistant-api/` — ASP.NET Core 10 Web API, namespace `personal_assistant_api`, EF Core with SQL Server `(localdb)\MSSQLLocalDB`, database `BudgetApp`
- **Frontend:** `frontend/angular/personal-assistant-web/` — Angular 21.1 standalone components, lazy-loaded routes, Bootstrap 5.3.8

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
| `GroceryCategory` | Name, Color (Bootstrap color name), UserId |
| `Supermarket` | Name, UserId |
| `GroceryItem` | Name, Barcode?, Manufacturer?, GroceryCategoryId?, UnitType (Units/Lbs), IsOnList, LastPrice?, LastQuantity?, LastSupermarketId?, UserId; [NotMapped] SupermarketIds: List&lt;int&gt; |
| `GroceryItemSupermarket` | GroceryItemId (FK, cascade), SupermarketId (FK, cascade) — composite PK, many-to-many join |
| `GroceryPurchase` | GroceryItemId (FK, cascade), SupermarketId (FK, restrict), PurchasedAt (DateTime), Price, Quantity, UserId |
| `PantryItem` | GroceryItemId? (FK), Name, Quantity, UnitType (Units/Lbs), PurchasedAt (DateOnly), ExpiresAt? (DateOnly), Notes?, UserId |
| `LoanPayment` | LoanId (FK), Date (DateOnly), PrincipalAmount, InterestAmount, InsuranceAmount, AdditionalPrincipal, UserId |
| `VehicleFuel` | VehicleId (FK), Date (DateOnly), PricePerGallon, TotalAmount, Gallons |
| `VehicleMaintenance` | VehicleId (FK), Date (DateOnly), Mileage, Type, Price, Notes, NextDate? (DateOnly), NextMileage? — powers auto-reminders |
| `VehicleMileageHistory` | VehicleId (FK), Date (DateOnly), Mileage — one row per vehicle per day, auto-upserted |
| `VehicleReminder` | VehicleId (FK), Type, Title, IsDone — auto-(re)created from NextDate/NextMileage |
| `VehicleTodo` | VehicleId (FK), Title, IsDone |
| `CreditCard` | Name, LastFourDigits, Color, Notes, CreatedAt, UserId |
| `CreditCardCategory` | Name, Color, Icon, UserId |
| `CreditCardCategoryLimit` | CreditCardCategoryId (FK), Month, Year, Amount, UserId |
| `CreditCardStatement` | CreditCardId (FK), FileName, BlobName, Status (Pending/…), ErrorMessage, UploadedAt, ProcessedAt?, StatementMonth?, StatementYear?, TotalAmount? |
| `CreditCardTransaction` | StatementId (FK), CreditCardId (FK), Date (DateOnly), Description, Amount, Type (Expense/…), CreditCardCategoryId?, Notes, IsAiClassified, CreatedAt, UserId |
| `PushSubscription` | Endpoint, P256dh, Auth, CreatedAt, UserId — Web Push VAPID subscription |
| `NotificationLog` | Type ("expired-transaction"/"maintenance-due"), EntityId (string), SentDate (DateOnly), UserId — dedupes push sends |
| `Technology` | Name, Color, Icon, Notes, UserId |
| `TechnologyPracticeSection` | TechnologyId (FK, cascade), Title — named subsection grouping practice items (e.g. "1. Fundamentos") |
| `TechnologyPracticeItem` | SectionId (FK, cascade to TechnologyPracticeSection — no direct Technology FK), Title, Subcategory, Points, Order, IsDone, CompletedAt (DateOnly?), Notes — one-time checklist entry; date+notes are set/cleared server-side when IsDone toggles; Order preserves creation/import sequence |
| `TechnologyTheorySection` | TechnologyId (FK, cascade), Title — same grouping concept as TechnologyPracticeSection, for theory questions |
| `TechnologyTheoryQuestion` | SectionId (FK, cascade to TechnologyTheorySection), Question, Subcategory, Points, Order, IsMastered, AnsweredAt (DateOnly?), Notes — same toggle pattern as TechnologyPracticeItem |

### Connection string

```
Server=(localdb)\MSSQLLocalDB;Database=BudgetApp;Trusted_Connection=True;TrustServerCertificate=True;
```

### Backend commands (run from `backend/dotnet/personal-assistant-api/`)

```bash
dotnet build
dotnet run                          # API at https://localhost:7146 / http://localhost:5082
dotnet ef migrations add <Name>     # requires: dotnet tool install -g dotnet-ef
dotnet ef database update
```

`personal-assistant-api.http` in the project root contains ready-made REST client requests for manual testing.

### Frontend commands (run from `frontend/angular/personal-assistant-web/`)

```bash
npm install
ng serve        # dev server at http://localhost:4200
ng build        # defaults to the production configuration
ng test
ng test --include=src/app/path/to/file.spec.ts   # single file
```

### Docker (local full stack)

```bash
docker compose up --build     # sql (mssql:2022) + api (:5085) + frontend (:4200, nginx)
```

Requires `SA_PASSWORD` and `JWT_KEY` env vars (or a `.env` file). The `api` service waits on the SQL healthcheck. The frontend image builds with `ng build --configuration docker` and serves through nginx, which reverse-proxies `/api/` to `API_UPSTREAM` (`default.conf.template`, templated by the nginx image at container start).

**Angular build configurations ↔ environment files** (`fileReplacements` in `angular.json`, all replacing `src/environments/environment.ts`):

| Configuration | Environment file | `apiBase` |
|---|---|---|
| `development` (default for `ng serve`) | `environment.ts` | `http://localhost:5085` |
| `production` (default for `ng build`) | `environment.production.ts` | legacy Azure App Service URL (decommissioned — superseded by the `azure` configuration below) |
| `docker` | `environment.docker.ts` | `http://localhost:5085` |
| `azure` | `environment.azure.ts` | `''` (relative — same-origin nginx proxies `/api/` to the container app) |

`API_BASE` in `constants/index.ts` reads `environment.apiBase`; `getApiBase()` layers a `localStorage['__PERSONAL_ASSISTANT_API_URL__']` override on top for the PWA/mobile dynamic-URL flow (see `api-url.interceptor.ts`).

## Architecture

### Backend (`backend/dotnet/personal-assistant-api/`)

- `Models/` — EF Core entity classes (one file per entity)
- `Data/PersonalAssistantDbContext.cs` — DbContext; all decimal fields use precision (18,2)
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
| BudgetsController | `api/budgets` | GET: `?month`, `?year`; GET `/year-summary?year=` and POST `/upsert` power the Limits matrix tab |
| GoalsController | `api/goals` | |
| RecurringTransactionsController | `api/recurring-transactions` | Sorted by DayOfMonth; POST `/generate?month=&year=` creates transactions from active templates, splitting by CutoffDay |
| AccountsController | `api/accounts` | GET `/{id}/history` returns last 6 months of AccountHistory ordered by date |
| LoansController | `api/loans` | Ordered by Name; GET/POST `/{id}/payments`, PUT/DELETE `/{id}/payments/{paymentId}` — payment ledger, `effectiveBalance` computed as LoanAmount − payments |
| BooksController | `api/books` | Ordered Reading→Paused→Wishlist→Completed then by Title (in-memory sort); GET `/{id}/progress` returns full BookProgress history; POST `/{id}/progress` upserts today's entry and updates Book.CurrentPage; GET/POST `/{id}/tasks`, PUT/DELETE `/{id}/tasks/{taskId}` — lab task CRUD |
| VehiclesController | `api/vehicles` | Ordered by Name; nested sub-resources per vehicle: `/maintenance`, `/fuel`, `/mileage-history` (GET only), `/todos`, `/reminders` — maintenance/fuel writes auto-upsert VehicleMileageHistory and regenerate reminders from NextDate/NextMileage |
| SupermarketsController | `api/supermarkets` | Ordered by Name; DELETE blocked if purchase history exists |
| GroceryCategoriesController | `api/grocery-categories` | Ordered by Name |
| GroceryItemsController | `api/grocery-items` | GET: `?onList=true`, `?supermarketId=X`; returns `SupermarketIds` list; PATCH `/{id}/toggle-list`; POST `/{id}/purchase` creates GroceryPurchase + updates LastPrice/LastQuantity/LastSupermarketId + sets IsOnList=false; GET `/purchases` all purchases |
| PantryController | `api/pantry` | CRUD + PATCH `/{id}/consume`; optionally links to a GroceryItem |
| TechnologiesController | `api/technologies` | Ordered by Name; GET/GetById merge computed scoring fields (`practiceEarnedPoints`/`practiceTotalPoints`/`theoryEarnedPoints`/`theoryTotalPoints`/`totalScore`/`level`) into the response — `totalScore` is proportional (`round(100 * earned / possible)` over the combined practice+theory pool, not a fixed 70/30 split); nested sub-resources per technology: `/practice-sections`, `/theory-sections` (GET/POST/PUT/DELETE — DELETE cascades its items/questions explicitly in code) and `/practice-items`, `/theory-questions` (GET/POST/PUT/DELETE — POST requires a `sectionId` belonging to that technology and assigns the next `Order`; PUT toggles IsDone/IsMastered and sets/clears CompletedAt/AnsweredAt server-side); POST `/import-csv` bulk-imports topics from raw CSV text (`Category,Subcategory,Name,Type,Points`) — creates/reuses practice/theory sections by **Subcategory** name (col 2, e.g. "Fundamentos"), stores **Category** (col 1) as an informative field on the topic, skips rows duplicating an existing (Subcategory, Name) pair, collects per-row errors instead of failing the whole import, and returns `{ imported, skipped, errors }` |
| CreditCardsController | `api/credit-cards` | CRUD; GET `/spending`; statement pipeline: POST `/{cardId}/statements` uploads PDF to Blob Storage, POST `/webhook` is the Logic Apps callback (Doc Intelligence + Claude Haiku extraction) that creates CreditCardTransaction rows, POST `/statements/{id}/simulate-webhook` for local testing without Logic Apps; GET/PUT/DELETE under `/statements/{id}` and `/transactions/{id}` for reviewing extracted rows |
| CreditCardCategoriesController | `api/credit-card-categories` | |
| CreditCardCategoryLimitsController | `api/credit-card-category-limits` | GET `/year-summary`; POST `/upsert` — mirrors BudgetsController's Limits pattern |
| AppSettingsController | `api/app-settings` | Singleton; GET auto-creates with defaults; PUT upserts |
| NotificationsController | `api/notifications` | Web Push (VAPID): GET `/public-key`, POST/DELETE `/subscribe`, POST `/dispatch` sends due notifications and logs to NotificationLog (dedup) |
| HealthController | `api/health` | Unauthenticated liveness check, used by container/App Service probes |
| DashboardController | `api/dashboard/summary?month=&year=` | Returns totalIncome, totalExpense, netBalance, totalInvested, spendingByCategory, budgetVsActual, goals |
| DashboardController | `api/dashboard/trend?months=6` | Returns net balance per billing period for the last N months |

**Auth pattern in controllers:** Every entity controller declares `private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;` and all DB queries filter by `UserId == CurrentUserId`. On POST/PUT, the controller sets `entity.UserId = CurrentUserId` before saving.

**JWT config** (in `appsettings.Development.json`): `Jwt:Key`, `Jwt:Issuer` (`"personal-assistant-api"`), `Jwt:Audience` (`"personal-assistant-frontend"`), `Jwt:ExpiresInMinutes` (1440). Token carries `NameIdentifier`, `Email`, and `Name` claims.

**Billing period logic (used in Transactions, Dashboard, RecurringTransaction generate):**
- Period starts on `CutoffDay` of the selected month and ends the day before `CutoffDay` of the next month.
- `GetPeriod(cutoffDay, month, year)` is a private static helper duplicated in both `TransactionsController` and `DashboardController`.

**Transaction ordering:** `OrderByDescending(IsExecuted).ThenBy(Date)` — executed rows sort first by date ascending, non-executed rows appear below.

**RecurringTransaction generate split rule:** If `DayOfMonth >= CutoffDay`, the transaction lands in the selected month; if `DayOfMonth < CutoffDay`, it lands in the next month.

### Frontend (`frontend/angular/personal-assistant-web/src/app/`)

All components are standalone; routes use `loadComponent` for lazy loading. No NgModules.

**Directory layout:**
- `views/` — one subfolder per feature: `dashboard`, `transactions`, `categories`, `budgets`, `goals`, `recurring-transactions`, `accounts`, `loans`, `books`, `vehicles`, `grocery`, `pantry`, `credit-cards`, `credit-card-categories`, `credit-card-category-limits`, `technologies`, `technology-dashboard`, `settings`, `auth`
- `layouts/` — `MainLayout` (root shell with `<router-outlet>`), `VerticalLayout` (sidebar + topbar + content + footer), `Sidenav`, `Topbar`, `Footer`
- `core/services/api/` — one service per entity plus `DashboardService`; all use `HttpClient` with `API_BASE` from `constants/index.ts` (resolved from the active environment file — see Docker section above)
- `core/services/auth.service.ts` — JWT stored in `localStorage` under `personal_assistant_token`; exposes `login()`, `register()`, `logout()`, `isLoggedIn`, `userEmail`, `userName`
- `core/interceptors/auth.interceptor.ts` — `HttpInterceptorFn` that injects `Authorization: Bearer <token>` on every request
- `core/interceptors/api-url.interceptor.ts` — rewrites `API_BASE` for PWA/mobile dynamic base URL
- `core/guards/auth.guard.ts` — redirects unauthenticated users to `/login`
- `core/services/layout.service.ts` — implements `CanActivate`; manages theme and sidenav state via Angular signals, persisted to `sessionStorage`
- `constants/index.ts` — `API_BASE` URL and `menuItems` array (sidebar nav links); add new pages here

**Routing:** `/login` is a standalone route (no `MainLayout`). All feature routes are children of `MainLayout`, guarded by both `LayoutService` and `authGuard`. The wildcard `**` redirects to `/login`.

**Sub-nav grouping:** `Transactions`, `RecurringTransactions`, `Categories`, and `Budgets` are four separate routes/components, but `Recurring`, `Categories`, and `Limits` are not in the sidebar (`constants/index.ts` menu only links `/transactions`, labeled "Budget") — each of the four views renders its own inline Bootstrap `nav-tabs` bar (`routerLink` + `routerLinkActive`) so they read as one section. `CreditCards`, `CreditCardCategories`, and `CreditCardCategoryLimits` follow the same pattern under the "Credit Cards" sidebar entry. `Technologies` and `TechnologyDashboard` follow it too, under the "Tech Mastery" sidebar entry (only `/technologies` is in `menuItems`).

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

### Integration tests (`backend/dotnet/personal-assistant-api.Tests/`)

Run with `dotnet test` from the solution root or from `backend/dotnet/`.

- `PersonalAssistantApiFactory` extends `WebApplicationFactory<Program>`, swaps SQL Server for `InMemoryDatabase`, and replaces JWT Bearer with `TestAuthHandler` (scheme name `"Test"`) so all requests are automatically authenticated as user id `TestAuthHandler.UserId` (`"test-user-id"`).
- `ResetDatabase()` wipes and recreates the in-memory DB between tests. `Seed<T>()` / `SeedMany<T>()` insert rows directly.
- When seeding entities that have `UserId`, set it to `TestAuthHandler.UserId` so they pass controller-level ownership filters.
- Test classes use `IClassFixture<PersonalAssistantApiFactory>` and call `factory.ResetDatabase()` in the constructor.

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
