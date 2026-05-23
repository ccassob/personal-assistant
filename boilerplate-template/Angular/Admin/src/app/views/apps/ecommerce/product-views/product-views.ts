import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Rating } from '@app/components/rating/rating'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { productData, ProductType } from './data'

@Component({
  selector: 'app-product-views',
  imports: [PageBreadcrumb, Icon, CustomPagination, AsyncPipe, FormsModule, NgbSortableHeader, RouterLink, Rating, Apexchart],
  providers: [TableService],
  templateUrl: './product-views.html',
  styles: ``,
})
export class ProductViews {
  productData = productData
  selectAll = false
  filterOrders = 'All'
  selectedIds = new Set<string>()
  productData$: Observable<ProductType[]>
  total$: Observable<number>
  constructor(public tableService: TableService<ProductType>) {
    this.productData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(productData, 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.productData.forEach((product) => this.selectedIds.add(product.sku))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: ProductType) {
    if (this.selectedIds.has(product.sku)) {
      this.selectedIds.delete(product.sku)
    } else {
      this.selectedIds.add(product.sku)
    }
    this.selectAll = this.selectedIds.size === this.productData.length
  }

  deleteSelected() {
    this.productData = this.productData.filter((product) => !this.selectedIds.has(product.sku))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(this.productData, 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
}
