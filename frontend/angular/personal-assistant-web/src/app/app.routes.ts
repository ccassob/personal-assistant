import { Routes } from '@angular/router'
import { MainLayout } from './layouts/main-layout'
import { LayoutService } from './core/services/layout.service'
import { authGuard } from './core/guards/auth.guard'

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./views/auth/auth').then(m => m.Auth) },
  {
    path: '',
    component: MainLayout,
    canActivate: [LayoutService, authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./views/dashboard/dashboard').then(m => m.Dashboard), data: { title: 'Dashboard' } },
      { path: 'transactions', loadComponent: () => import('./views/transactions/transactions').then(m => m.Transactions), data: { title: 'Transactions' } },
      { path: 'categories', loadComponent: () => import('./views/categories/categories').then(m => m.Categories), data: { title: 'Categories' } },
      { path: 'budgets', loadComponent: () => import('./views/budgets/budgets').then(m => m.Budgets), data: { title: 'Budgets' } },
      { path: 'goals', loadComponent: () => import('./views/goals/goals').then(m => m.Goals), data: { title: 'Goals' } },
      { path: 'recurring-transactions', loadComponent: () => import('./views/recurring-transactions/recurring-transactions').then(m => m.RecurringTransactions), data: { title: 'Recurring Transactions' } },
      { path: 'loans', loadComponent: () => import('./views/loans/loans').then(m => m.Loans), data: { title: 'Loans' } },
      { path: 'credit-cards', loadComponent: () => import('./views/credit-cards/credit-cards').then(m => m.CreditCards), data: { title: 'Credit Cards' } },
      { path: 'credit-card-categories', loadComponent: () => import('./views/credit-card-categories/credit-card-categories').then(m => m.CreditCardCategories), data: { title: 'Credit Card Categories' } },
      { path: 'credit-card-category-limits', loadComponent: () => import('./views/credit-card-category-limits/credit-card-category-limits').then(m => m.CreditCardCategoryLimits), data: { title: 'CC Limits' } },
      { path: 'vehicles', loadComponent: () => import('./views/vehicles/vehicles').then(m => m.Vehicles), data: { title: 'Vehicles' } },
      { path: 'books', loadComponent: () => import('./views/books/books').then(m => m.Books), data: { title: 'Books' } },
      { path: 'accounts', loadComponent: () => import('./views/accounts/accounts').then(m => m.Accounts), data: { title: 'Accounts' } },
      { path: 'grocery', loadComponent: () => import('./views/grocery/grocery').then(m => m.Grocery), data: { title: 'Grocery' } },
      { path: 'pantry', loadComponent: () => import('./views/pantry/pantry').then(m => m.Pantry), data: { title: 'Pantry' } },
      { path: 'technologies', loadComponent: () => import('./views/technologies/technologies').then(m => m.Technologies), data: { title: 'Tech Mastery' } },
      { path: 'technology-dashboard', loadComponent: () => import('./views/technology-dashboard/technology-dashboard').then(m => m.TechnologyDashboard), data: { title: 'Tech Dashboard' } },
      { path: 'technology-audio', loadComponent: () => import('./views/technology-audio/technology-audio').then(m => m.TechnologyAudio), data: { title: 'Audios de estudio' } },
      { path: 'settings', loadComponent: () => import('./views/settings/settings').then(m => m.Settings), data: { title: 'Settings' } },
    ],
  },
  { path: '**', redirectTo: 'login' },
]
