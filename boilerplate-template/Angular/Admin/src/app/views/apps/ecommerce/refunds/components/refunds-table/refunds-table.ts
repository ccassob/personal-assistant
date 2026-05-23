import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { refundData, RefundType } from '../../data'

@Component({
  selector: 'app-refunds-table',
  imports: [Icon, CustomPagination, AsyncPipe, NgbSortableHeader, FormsModule, RouterLink, NgbDropdownModule],
  providers: [TableService],
  templateUrl: './refunds-table.html',
  styles: ``,
})
export class RefundsTable {
  filterrefundStatus = 'All'
  selectAll = false
  selectedIds = new Set<string>()
  refundData = refundData
  refundData$: Observable<RefundType[]>
  total$: Observable<number>
  constructor(public tableService: TableService<RefundType>) {
    this.refundData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }
  flatPickrOptions = {
    dateFormat: 'd M, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(refundData), 8)
  }
  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.refundData.forEach((product) => this.selectedIds.add(product.orderId))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: RefundType) {
    if (this.selectedIds.has(product.orderId)) {
      this.selectedIds.delete(product.orderId)
    } else {
      this.selectedIds.add(product.orderId)
    }
    this.selectAll = this.selectedIds.size === this.refundData.length
  }
  deleteSelected() {
    this.refundData = this.refundData.filter((product) => !this.selectedIds.has(product.orderId))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.refundData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
