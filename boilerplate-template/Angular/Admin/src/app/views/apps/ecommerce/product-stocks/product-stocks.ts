import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { productStockData, ProductStockType } from './data'

@Component({
  selector: 'app-product-stocks',
  imports: [PageBreadcrumb, FormsModule, Icon, CustomPagination, NgbSortableHeader, RouterLink, AsyncPipe],
  providers: [TableService],
  templateUrl: './product-stocks.html',
  styles: ``,
})
export class ProductStocks {
  filtercategory = 'All'
  filterstatus = 'All'
  filterPrice = 'All'

  selectAll = false
  selectedIds = new Set<string>()
  productStockData = productStockData

  productStockData$: Observable<ProductStockType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ProductStockType>) {
    this.productStockData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(productStockData), 10)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.productStockData.forEach((product) => this.selectedIds.add(product.sku))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: ProductStockType) {
    if (this.selectedIds.has(product.sku)) {
      this.selectedIds.delete(product.sku)
    } else {
      this.selectedIds.add(product.sku)
    }
    this.selectAll = this.selectedIds.size === this.productStockData.length
  }

  deleteSelected() {
    this.productStockData = this.productStockData.filter((product) => !this.selectedIds.has(product.sku))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.productStockData), 10)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
  protected readonly toPascalCase = toPascalCase
}
