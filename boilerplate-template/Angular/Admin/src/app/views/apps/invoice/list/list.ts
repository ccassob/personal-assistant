import { generateInitials, toPascalCase } from '@/app/utils/string'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { Observable } from 'rxjs'
import { invoiceData, InvoiceType } from './data'

@Component({
  selector: 'app-list',
  imports: [PageBreadcrumb, Icon, RouterLink, CustomPagination, NgbSortableHeader, CommonModule, FormsModule],
  providers: [TableService],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  invoiceData = invoiceData
  selectAll = false
  searchTerm = ''
  filterStatus = ''
  invoiceData$: Observable<InvoiceType[]>
  total$: Observable<number>
  selectedIds = new Set<string>()

  constructor(public tableService: TableService<InvoiceType>) {
    this.invoiceData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.invoiceData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.invoiceData.forEach((exp) => this.selectedIds.add(exp.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(expense: InvoiceType) {
    if (this.selectedIds.has(expense.id)) {
      this.selectedIds.delete(expense.id)
    } else {
      this.selectedIds.add(expense.id)
    }
    this.selectAll = this.selectedIds.size === this.invoiceData.length
  }

  deleteSelected() {
    this.invoiceData = this.invoiceData.filter((exp) => !this.selectedIds.has(exp.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.invoiceData), 8)
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly generateInitials = generateInitials
  protected readonly toPascalCase = toPascalCase
}
