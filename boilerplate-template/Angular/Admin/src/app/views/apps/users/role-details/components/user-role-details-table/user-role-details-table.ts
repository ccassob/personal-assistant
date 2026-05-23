import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { userData, UserType } from '../../data'

@Component({
  selector: 'app-user-role-details-table',
  imports: [Icon, RouterLink, CustomPagination, AsyncPipe, FormsModule, NgbSortableHeader],
  providers: [TableService],
  templateUrl: './user-role-details-table.html',
  styles: ``,
})
export class UserRoleDetailsTable {
  userData = userData
  selectAll = false
  searchTerm = ''
  filterStatus = 'All'
  userData$: Observable<UserType[]>
  total$: Observable<number>
  selectedIds = new Set<string>()
  private modalService = inject(NgbModal)

  addUserModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' })
  }
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
      this.userData.forEach((exp) => this.selectedIds.add(exp.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(expense: UserType) {
    if (this.selectedIds.has(expense.id)) {
      this.selectedIds.delete(expense.id)
    } else {
      this.selectedIds.add(expense.id)
    }
    this.selectAll = this.selectedIds.size === this.userData.length
  }

  deleteSelected() {
    this.userData = this.userData.filter((exp) => !this.selectedIds.has(exp.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.userData), 8)
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
