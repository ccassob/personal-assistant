import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { BillingDetails } from './components/billing-details/billing-details'
import { CustomerDetail } from './components/customer-detail/customer-detail'
import { OrderSummary } from './components/order-summary/order-summary'
import { ShippingActivity } from './components/shipping-activity/shipping-activity'
import { ShippingAddress } from './components/shipping-address/shipping-address'

@Component({
  selector: 'app-order-details',
  imports: [PageBreadcrumb, OrderSummary, ShippingActivity, CustomerDetail, ShippingAddress, BillingDetails],
  templateUrl: './order-details.html',
  styles: ``,
})
export class OrderDetails {}
