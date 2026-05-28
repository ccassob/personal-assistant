import { Routes } from '@angular/router'
import { MainLayout } from './layouts/main-layout'
import { LayoutService } from './core/services/layout.service'

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [LayoutService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./views/dashboard/dashboard').then(m => m.Dashboard), data: { title: 'Dashboard' } },
      { path: 'transactions', loadComponent: () => import('./views/transactions/transactions').then(m => m.Transactions), data: { title: 'Transactions' } },
      { path: 'categories', loadComponent: () => import('./views/categories/categories').then(m => m.Categories), data: { title: 'Categories' } },
      { path: 'budgets', loadComponent: () => import('./views/budgets/budgets').then(m => m.Budgets), data: { title: 'Budgets' } },
      { path: 'goals', loadComponent: () => import('./views/goals/goals').then(m => m.Goals), data: { title: 'Goals' } },
      { path: 'recurring-transactions', loadComponent: () => import('./views/recurring-transactions/recurring-transactions').then(m => m.RecurringTransactions), data: { title: 'Recurring Transactions' } },
      { path: 'loans', loadComponent: () => import('./views/loans/loans').then(m => m.Loans), data: { title: 'Loans' } },
      { path: 'vehicles', loadComponent: () => import('./views/vehicles/vehicles').then(m => m.Vehicles), data: { title: 'Vehicles' } },
      { path: 'books', loadComponent: () => import('./views/books/books').then(m => m.Books), data: { title: 'Books' } },
      { path: 'accounts', loadComponent: () => import('./views/accounts/accounts').then(m => m.Accounts), data: { title: 'Accounts' } },
      { path: 'settings', loadComponent: () => import('./views/settings/settings').then(m => m.Settings), data: { title: 'Settings' } },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
]
