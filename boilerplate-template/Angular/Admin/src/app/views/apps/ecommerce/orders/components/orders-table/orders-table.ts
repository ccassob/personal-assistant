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
import { OrderType, orderData } from '../../data'

@Component({
  selector: 'app-orders-table',
  imports: [Icon, RouterLink, FormsModule, CustomPagination, NgbSortableHeader, AsyncPipe],
  providers: [TableService],
  templateUrl: './orders-table.html',
  styles: ``,
})
export class OrdersTable {
  filterOrderStatus = 'All'
  filterPaymentStatus = 'All'
  filterDateRange = ''
  selectAll = false
  selectedIds = new Set<string>()
  orderData = orderData

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.orderData.forEach((order) => this.selectedIds.add(order.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(order: OrderType) {
    if (this.selectedIds.has(order.id)) {
      this.selectedIds.delete(order.id)
    } else {
      this.selectedIds.add(order.id)
    }
    this.selectAll = this.selectedIds.size === this.orderData.length
  }

  deleteSelected() {
    this.orderData = this.orderData.filter((order) => !this.selectedIds.has(order.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.orderData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
  orderData$: Observable<OrderType[]>
  total$: Observable<number>
  constructor(public tableService: TableService<OrderType>) {
    this.orderData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(orderData), 8)
  }
  protected readonly toPascalCase = toPascalCase
}
