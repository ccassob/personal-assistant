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
import { FlatpickrDirective } from 'angularx-flatpickr'
import { Observable } from 'rxjs'
import { purchasedOrderData, PurchasedOrderType } from './data'

@Component({
  selector: 'app-purchased-orders',
  imports: [PageBreadcrumb, FormsModule, AsyncPipe, NgbSortableHeader, CustomPagination, Icon, RouterLink, FlatpickrDirective],
  providers: [TableService],
  templateUrl: './purchased-orders.html',
  styles: ``,
})
export class PurchasedOrders {
  purchasedOrderData = purchasedOrderData
  filterOrderStatus = 'All'
  filterPaymentStatus = 'All'
  selectAll = false
  selectedIds = new Set<string>()
  purchasedOrderData$: Observable<PurchasedOrderType[]>
  total$: Observable<number>

  flatPickrOptions = {
    dateFormat: 'd M, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }

  constructor(public tableService: TableService<PurchasedOrderType>) {
    this.purchasedOrderData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(purchasedOrderData), 10)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.purchasedOrderData.forEach((product) => this.selectedIds.add(product.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: PurchasedOrderType) {
    if (this.selectedIds.has(product.id)) {
      this.selectedIds.delete(product.id)
    } else {
      this.selectedIds.add(product.id)
    }
    this.selectAll = this.selectedIds.size === this.purchasedOrderData.length
  }

  deleteSelected() {
    this.purchasedOrderData = this.purchasedOrderData.filter((product) => !this.selectedIds.has(product.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.purchasedOrderData), 10)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
