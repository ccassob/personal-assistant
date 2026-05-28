import { MenuItemType } from '../types'

export const APP_NAME = 'BudgetApp'
export const API_BASE = 'http://localhost:5082'
export const currentYear = new Date().getFullYear()

export const menuItems: MenuItemType[] = [
  { slug: 'dashboard', label: 'Dashboard', icon: 'tabler:dashboard', url: '/dashboard' },
  { slug: 'transactions', label: 'Transactions', icon: 'tabler:arrows-exchange', url: '/transactions' },
  { slug: 'recurring-transactions', label: 'Recurring', icon: 'tabler:refresh', url: '/recurring-transactions' },
  { slug: 'categories', label: 'Categories', icon: 'tabler:category', url: '/categories' },
  { slug: 'budgets', label: 'Budgets', icon: 'tabler:chart-bar', url: '/budgets' },
  { slug: 'goals', label: 'Goals', icon: 'tabler:target', url: '/goals' },
  { slug: 'loans', label: 'Loans', icon: 'tabler:credit-card', url: '/loans' },
  { slug: 'vehicles', label: 'Vehicles', icon: 'tabler:car', url: '/vehicles' },
  { slug: 'books', label: 'Books', icon: 'tabler:book', url: '/books' },
  { slug: 'accounts', label: 'Accounts', icon: 'tabler:wallet', url: '/accounts' },
  { slug: 'settings', label: 'Settings', icon: 'tabler:settings', url: '/settings' },
]
