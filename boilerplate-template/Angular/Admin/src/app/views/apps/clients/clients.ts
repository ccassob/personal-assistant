import { toTitleCase } from '@/app/utils/string'
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
import { clientData, ClientType } from './data'

@Component({
  selector: 'app-clients',
  imports: [PageBreadcrumb, Icon, RouterLink, NgbSortableHeader, FormsModule, AsyncPipe, CustomPagination],
  providers: [TableService],
  templateUrl: './clients.html',
  styles: ``,
})
export class Clients {
  clientData = clientData

  filterProjectType = 'All'
  filterByCountry = 'All'
  selectAll = false
  sortCountries = clientData.slice(0, 5)
  clientData$: Observable<ClientType[]>
  total$: Observable<number>
  selectedIds = new Set<number>()

  constructor(public tableService: TableService<ClientType>) {
    this.clientData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.clientData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked

    this.selectedIds.clear()

    if (checked) {
      this.clientData.forEach((_, index) => this.selectedIds.add(index))
    }
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }
    this.selectAll = this.selectedIds.size === this.clientData.length
  }

  deleteSelected() {
    this.clientData = this.clientData.filter((_, index) => !this.selectedIds.has(index))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.clientData), 8)
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
  protected readonly toTitleCase = toTitleCase
}
