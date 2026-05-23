import { Type } from '@angular/core'
import { BillingInfo } from './components/billing-info/billing-info'
import { InvoiceDetail } from './components/invoice-detail/invoice-detail'
import { PaymentInfo } from './components/payment-info/payment-info'
import { ShippingInfo } from './components/shipping-info/shipping-info'

export type checkoutStepType = {
  id: string
  icon: string
  title: string
  content: Type<any>
}

export const checkoutStepsData: checkoutStepType[] = [
  {
    id: 'stuInfo',
    icon: 'user-circle',
    title: 'Billing Info',
    content: BillingInfo,
  },
  {
    id: 'addrInfo',
    icon: 'truck',
    title: 'Shipping Info',
    content: ShippingInfo,
  },
  {
    id: 'courseInfo',
    icon: 'credit-card',
    title: 'Payment Info',
    content: PaymentInfo,
  },
  {
    id: 'parentInfo',
    icon: 'checks',
    title: 'Finish',
    content: InvoiceDetail,
  },
]
