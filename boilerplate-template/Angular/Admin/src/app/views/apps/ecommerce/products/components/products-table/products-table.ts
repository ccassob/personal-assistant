import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { Rating } from '@app/components/rating/rating'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { productData, ProductType } from '../../data'

@Component({
  selector: 'app-products-table',
  imports: [Icon, RouterLink, FormsModule, CustomPagination, NgbSortableHeader, Rating, AsyncPipe],
  providers: [TableService],
  templateUrl: './products-table.html',
  styles: ``,
})
export class ProductsTable {
  filterCategory = 'All'
  filterStatus = 'All'
  filterPrice = 'All'
  selectAll = false
  selectedIds = new Set<string>()
  productData = productData

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.productData.forEach((product) => this.selectedIds.add(product.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: ProductType) {
    if (this.selectedIds.has(product.id)) {
      this.selectedIds.delete(product.id)
    } else {
      this.selectedIds.add(product.id)
    }
    this.selectAll = this.selectedIds.size === this.productData.length
  }

  deleteSelected() {
    this.productData = this.productData.filter((product) => !this.selectedIds.has(product.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.productData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  productData$: Observable<ProductType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ProductType>) {
    this.productData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(productData), 8)
  }
  protected readonly toPascalCase = toPascalCase
}
