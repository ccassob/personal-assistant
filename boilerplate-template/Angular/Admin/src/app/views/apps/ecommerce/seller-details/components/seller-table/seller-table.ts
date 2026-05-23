import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { sellerProductData, SellerProductType } from '../../data'

@Component({
  selector: 'app-seller-table',
  imports: [RouterLink, Icon, CustomPagination, NgbSortableHeader, AsyncPipe, FormsModule],
  templateUrl: './seller-table.html',
  providers: [TableService],
  styles: ``,
})
export class SellerTable {
  selectAll = false
  selectedIds = new Set<string>()
  sellerProductData = sellerProductData

  sellerProductData$: Observable<SellerProductType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<SellerProductType>) {
    this.sellerProductData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(sellerProductData, 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.sellerProductData.forEach((seller) => this.selectedIds.add(seller.name))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: SellerProductType) {
    if (this.selectedIds.has(product.name)) {
      this.selectedIds.delete(product.name)
    } else {
      this.selectedIds.add(product.name)
    }
    this.selectAll = this.selectedIds.size === this.sellerProductData.length
  }

  deleteSelected() {
    this.sellerProductData = this.sellerProductData.filter((seller) => !this.selectedIds.has(seller.name))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(this.sellerProductData, 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
