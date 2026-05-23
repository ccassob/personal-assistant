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
import { userData, UserType } from '../../data'

@Component({
  selector: 'app-user-table',
  imports: [Icon, NgbSortableHeader, AsyncPipe, FormsModule, RouterLink, CustomPagination],
  providers: [TableService],
  templateUrl: './user-table.html',
  styles: ``,
})
export class UserTable {
  userData = userData
  selectAll = false
  searchTerm = ''
  filterroles = 'All'
  filterStatus = 'All'
  userData$: Observable<UserType[]>
  total$: Observable<number>
  selectedIds = new Set<string>()

  constructor(public tableService: TableService<UserType>) {
    this.userData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.userData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.userData.forEach((user) => this.selectedIds.add(user.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(user: UserType) {
    if (this.selectedIds.has(user.id)) {
      this.selectedIds.delete(user.id)
    } else {
      this.selectedIds.add(user.id)
    }
    this.selectAll = this.selectedIds.size === this.userData.length
  }

  deleteSelected() {
    this.userData = this.userData.filter((user) => !this.selectedIds.has(user.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.userData), 8)
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
  protected readonly toPascalCase = toPascalCase
}
