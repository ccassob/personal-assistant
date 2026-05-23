import { Icon } from '@/app/components/icon/icon'
import { Rating } from '@/app/components/rating/rating'
import { TableService } from '@/app/core/services/table.service'
import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Observable } from 'rxjs'
import { customTableData, CustomTableType } from '../../data'

@Component({
  selector: 'app-table-with-filters',
  imports: [AsyncPipe, FormsModule, Icon, Rating, CustomPagination, RouterLink],
  providers: [TableService],
  templateUrl: './table-with-filters.html',
  styles: ``,
})
export class TableWithFilters {
  filterCategory = 'All'
  filterStatus = 'All'
  selectAll = false
  selectedIds = new Set<number>()
  customTableData = customTableData
  customTableData$: Observable<CustomTableType[]>
  total$: Observable<number>

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked

    this.selectedIds.clear()

    if (checked) {
      this.customTableData.forEach((_, index) => this.selectedIds.add(index))
    }
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }
    this.selectAll = this.selectedIds.size === this.customTableData.length
  }

  deleteSelected() {
    this.customTableData = this.customTableData.filter((_, index) => !this.selectedIds.has(index))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.customTableData), 10)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  constructor(public tableService: TableService<CustomTableType>) {
    this.customTableData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(customTableData), 5)
  }

  protected readonly toPascalCase = toPascalCase
}
