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
import { warehouseData, WarehouseType } from './data'

@Component({
  selector: 'app-warehouse',
  imports: [PageBreadcrumb, Icon, AsyncPipe, NgbSortableHeader, FormsModule, RouterLink, CustomPagination],
  providers: [TableService],
  templateUrl: './warehouse.html',
  styles: ``,
})
export class Warehouse {
  warehouseData = warehouseData

  selectAll = false
  warehousestatus = 'All'
  warehouselocation = 'All'
  selectedIds = new Set<string>()
  warehouseData$: Observable<WarehouseType[]>
  total$: Observable<number>
  constructor(public tableService: TableService<WarehouseType>) {
    this.warehouseData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(warehouseData), 10)
  }
  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.warehouseData.forEach((exp) => this.selectedIds.add(exp.id))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: WarehouseType) {
    if (this.selectedIds.has(product.id)) {
      this.selectedIds.delete(product.id)
    } else {
      this.selectedIds.add(product.id)
    }
    this.selectAll = this.selectedIds.size === this.warehouseData.length
  }
  deleteSelected() {
    this.warehouseData = this.warehouseData.filter((exp) => !this.selectedIds.has(exp.id))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.warehouseData), 10)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
