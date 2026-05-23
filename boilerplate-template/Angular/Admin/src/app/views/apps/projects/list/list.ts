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
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { projectData, ProjectType } from './data'

@Component({
  selector: 'app-list',
  imports: [PageBreadcrumb, RouterLink, Icon, CustomPagination, NgbSortableHeader, FormsModule, AsyncPipe, NgbProgressbar],
  providers: [TableService],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  projectData = projectData
  selectAll = false
  searchTerm = ''
  filterStatus = ''
  filterDateRange = ''
  filterCategory = ''
  projectData$: Observable<ProjectType[]>
  total$: Observable<number>
  selectedIds = new Set<number>()

  constructor(public tableService: TableService<ProjectType>) {
    this.projectData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.projectData), 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked

    this.selectedIds.clear()

    if (checked) {
      this.projectData.forEach((_, index) => this.selectedIds.add(index))
    }
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }
    this.selectAll = this.selectedIds.size === this.projectData.length
  }

  deleteSelected() {
    this.projectData = this.projectData.filter((_, index) => !this.selectedIds.has(index))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.projectData), 10)
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
