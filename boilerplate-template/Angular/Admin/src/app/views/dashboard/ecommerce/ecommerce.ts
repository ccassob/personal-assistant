import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { OrderStatistics } from './components/order-statistics/order-statistics'
import { ProductInventory } from './components/product-inventory/product-inventory'
import { RecentOrders } from './components/recent-orders/recent-orders'
import { StatisticsWidget } from './components/statistics-widget/statistics-widget'
import { Transactions } from './components/transactions/transactions'
import { statisticData } from './data'

@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [PageBreadcrumb, StatisticsWidget, OrderStatistics, ProductInventory, RecentOrders, Transactions],
  templateUrl: './ecommerce.html',
  styles: ``,
})
export class Ecommerce {
  statisticData = statisticData
}
