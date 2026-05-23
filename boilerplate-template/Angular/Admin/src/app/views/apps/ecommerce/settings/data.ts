import { Type } from '@angular/core'
import { Advanced } from './components/advanced/advanced'
import { BackupRestore } from './components/backup-restore/backup-restore'
import { Branding } from './components/branding/branding'
import { CurrencyTax } from './components/currency-tax/currency-tax'
import { GeneralInfo } from './components/general-info/general-info'
import { Integrations } from './components/integrations/integrations'
import { Invoices } from './components/invoices/invoices'
import { Notifications } from './components/notifications/notifications'
import { Payments } from './components/payments/payments'
import { SeoLegal } from './components/seo-legal/seo-legal'
import { Shipping } from './components/shipping/shipping'
import { StoreDetails } from './components/store-details/store-details'

type SettingStepType = {
  icon: string
  title: string
  subtitle: string
  content: Type<any>
}

export const settingStepData: SettingStepType[] = [
  {
    icon: 'building-store',
    title: 'General Info',
    subtitle: 'Shop basics',
    content: GeneralInfo,
  },
  {
    icon: 'building',
    title: 'Store Details',
    subtitle: 'Business info',
    content: StoreDetails,
  },
  {
    icon: 'palette',
    title: 'Branding',
    subtitle: 'Logo & colors',
    content: Branding,
  },
  {
    icon: 'pig-money',
    title: 'Currency & Tax',
    subtitle: 'Regional setup',
    content: CurrencyTax,
  },
  {
    icon: 'truck',
    title: 'Shipping',
    subtitle: 'Delivery setup',
    content: Shipping,
  },
  {
    icon: 'credit-card',
    title: 'Payments',
    subtitle: 'Gateways & modes',
    content: Payments,
  },
  {
    icon: 'bell',
    title: 'Notifications',
    subtitle: 'Emails & alerts',
    content: Notifications,
  },
  {
    icon: 'file-text',
    title: 'Invoices & Receipts',
    subtitle: 'Billing templates',
    content: Invoices,
  },
  {
    icon: 'world',
    title: 'SEO & Legal',
    subtitle: 'Policies & SEO',
    content: SeoLegal,
  },
  {
    icon: 'plug',
    title: 'Integrations',
    subtitle: '3rd-party apps',
    content: Integrations,
  },
  {
    icon: 'database',
    title: 'Backup & Restore',
    subtitle: 'Data recovery',
    content: BackupRestore,
  },
  {
    icon: 'settings',
    title: 'Advanced',
    subtitle: 'System controls',
    content: Advanced,
  },
]
