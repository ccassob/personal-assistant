import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ProductsTable } from './components/products-table/products-table'
import { ProductsWidget } from './components/products-widget/products-widget'
import { statData } from './data'

@Component({
  selector: 'app-products',
  imports: [PageBreadcrumb, ProductsWidget, ProductsTable],
  templateUrl: './products.html',
  styles: ``,
})
export class Products {
  statData = statData
}
