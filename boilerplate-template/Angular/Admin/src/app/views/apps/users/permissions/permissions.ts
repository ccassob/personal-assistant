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
import { ManagementType, permissionManagementData } from './data'

@Component({
  selector: 'app-permissions',
  imports: [PageBreadcrumb, Icon, CustomPagination, AsyncPipe, FormsModule, NgbSortableHeader, RouterLink],
  providers: [TableService],
  templateUrl: './permissions.html',
  styles: ``,
})
export class Permissions {
  permissionManagementData = permissionManagementData
  selectAll = false
  permissionManagementData$: Observable<ManagementType[]>
  total$: Observable<number>
  selectedIds = new Set<number>()

  constructor(public tableService: TableService<ManagementType>) {
    this.permissionManagementData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.permissionManagementData), 8)
  }

  deleteSelected() {
    this.permissionManagementData = this.permissionManagementData.filter((_, index) => !this.selectedIds.has(index))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.permissionManagementData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
}
