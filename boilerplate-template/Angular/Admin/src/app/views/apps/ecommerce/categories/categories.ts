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
import { Observable } from 'rxjs'
import { categoryData, CategoryType } from './data'

@Component({
  selector: 'app-categories',
  imports: [PageBreadcrumb, Icon, RouterLink, CustomPagination, FormsModule, NgbSortableHeader, AsyncPipe],
  providers: [TableService],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories {
  filterStatus = 'All'
  selectAll = false
  selectedIds = new Set<string>()
  categoryData = categoryData

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.categoryData.forEach((product) => this.selectedIds.add(product.slug))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: CategoryType) {
    if (this.selectedIds.has(product.slug)) {
      this.selectedIds.delete(product.slug)
    } else {
      this.selectedIds.add(product.slug)
    }
    this.selectAll = this.selectedIds.size === this.categoryData.length
  }

  deleteSelected() {
    this.categoryData = this.categoryData.filter((product) => !this.selectedIds.has(product.slug))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.categoryData), 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  categoryData$: Observable<CategoryType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<CategoryType>) {
    this.categoryData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(categoryData), 8)
  }

  protected readonly toPascalCase = toPascalCase
}
