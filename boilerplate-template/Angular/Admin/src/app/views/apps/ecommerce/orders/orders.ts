import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { OrdersTable } from './components/orders-table/orders-table'
import { OrdersWidget } from './components/orders-widget/orders-widget'
import { orderStatData } from './data'

@Component({
  selector: 'app-orders',
  imports: [PageBreadcrumb, OrdersWidget, OrdersTable],
  templateUrl: './orders.html',
  styles: ``,
})
export class Orders {
  orderStatData = orderStatData
}
