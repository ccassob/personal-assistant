export const META_DATA = {
  name: 'Inspinia',
  title: 'INSPINIA - Responsive Bootstrap 5 Admin Dashboard Template',
  description: 'Inspinia is the #1 best-selling admin dashboard template on Wrapmarket. Perfect for building CRM, CMS, project management tools, and custom web apps with clean UI, responsive design, and powerful features.',
  author: 'WebAppLayers',
  username: 'Damian D.',
  keywords: 'Inspinia, admin dashboard, Wrapmarket, Wrapbootstrap, HTML template, Bootstrap admin, CRM template, CMS template, responsive admin, web app UI, admin theme, best admin template',
  version: '5.0.0',
  buyUrl: 'https://wrapmarket.com/item/inspinia-multipurpose-admin-dashboard-template-WB0R5L90S?via=webapp',
  supportUrl: '__supportUrl__',
}

export const currentYear = new Date().getFullYear()

import { environment } from '../../environments/environment'

export const APP_NAME = 'BudgetApp'
export const API_BASE = environment.apiBase

export function getApiBase(): string {
  return localStorage.getItem('__BUDGET_API_URL__') ?? API_BASE
}

import { MenuItemType } from '../types'

export const menuItems: MenuItemType[] = [
  { slug: 'dashboard', label: 'Dashboard', icon: 'dashboard', url: '/dashboard' },
  { slug: 'transactions', label: 'Transactions', icon: 'arrows-exchange', url: '/transactions' },
  { slug: 'recurring-transactions', label: 'Recurring', icon: 'refresh', url: '/recurring-transactions' },
  { slug: 'categories', label: 'Categories', icon: 'category', url: '/categories' },
  { slug: 'budgets', label: 'Budgets', icon: 'chart-bar', url: '/budgets' },
  { slug: 'goals', label: 'Goals', icon: 'target', url: '/goals' },
  { slug: 'loans', label: 'Loans', icon: 'credit-card', url: '/loans' },
  { slug: 'vehicles', label: 'Vehicles', icon: 'car', url: '/vehicles' },
  { slug: 'books', label: 'Books', icon: 'book', url: '/books' },
  { slug: 'accounts', label: 'Accounts', icon: 'wallet', url: '/accounts' },
  { slug: 'grocery', label: 'Grocery', icon: 'shopping-cart', url: '/grocery' },
  { slug: 'pantry', label: 'Pantry', icon: 'fridge', url: '/pantry' },
  { slug: 'settings', label: 'Settings', icon: 'settings', url: '/settings' },
]
