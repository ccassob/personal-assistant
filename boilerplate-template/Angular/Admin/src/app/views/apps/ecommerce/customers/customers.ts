import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { customerData, CustomerType } from './data'

@Component({
  selector: 'app-customers',
  imports: [PageBreadcrumb, NgbDropdownModule, Icon, RouterLink, FormsModule, NgbSortableHeader, CustomPagination, AsyncPipe],
  providers: [TableService],
  templateUrl: './customers.html',
  styles: ``,
})
export class Customers implements OnInit {
  selectAll = false
  selectedIds = new Set<string>()
  customerData = customerData
  customerData$: Observable<CustomerType[]>
  total$: Observable<number>

  flatPickrOptions = {
    dateFormat: 'd M, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }

  constructor(public tableService: TableService<CustomerType>) {
    this.customerData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(customerData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.customerData.forEach((exp) => this.selectedIds.add(exp.email))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: CustomerType) {
    if (this.selectedIds.has(product.email)) {
      this.selectedIds.delete(product.email)
    } else {
      this.selectedIds.add(product.email)
    }
    this.selectAll = this.selectedIds.size === this.customerData.length
  }

  deleteSelected() {
    this.customerData = this.customerData.filter((exp) => !this.selectedIds.has(exp.email))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.customerData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
