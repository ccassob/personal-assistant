import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { FlatpickrDirective } from 'angularx-flatpickr'
import { Observable } from 'rxjs'
import { getSalesChartOptions, saleData, SaleType } from './data'

type MyFlatpickrOptions = {
  dateFormat?: string
  mode?: 'single' | 'range' | 'multiple'
  defaultDate?: Date | Date[] | string | null
  monthSelectorType?: 'dropdown'
}

@Component({
  selector: 'app-sales',
  imports: [PageBreadcrumb, Apexchart, AsyncPipe, FormsModule, NgbSortableHeader, Icon, CustomPagination, FlatpickrDirective],
  providers: [TableService],
  templateUrl: './sales.html',
  styles: ``,
})
export class Sales {
  getSalesChartOptions = getSalesChartOptions
  saleData = saleData
  filterOrders = 'All'
  selectAll = false
  selectedIds = new Set<number>()
  saleData$: Observable<SaleType[]>
  total$: Observable<number>

  date: Date[] | null = null

  private getCurrentMonthRange(): Date[] {
    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setMonth(end.getMonth() + 1)
    end.setDate(0)
    end.setHours(23, 59, 59, 999)

    return [start, end]
  }

  flatpickrOptions: MyFlatpickrOptions = {
    dateFormat: 'd M, Y',
    mode: 'range',
    defaultDate: this.getCurrentMonthRange(),
    monthSelectorType: 'dropdown',
  }

  constructor(public tableService: TableService<SaleType>) {
    this.saleData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(this.saleData), 8)
    this.flatpickrOptions.defaultDate = this.getCurrentMonthRange()
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked

    this.selectedIds.clear()

    if (checked) {
      this.saleData.forEach((_, index) => this.selectedIds.add(index))
    }
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }
    this.selectAll = this.selectedIds.size === this.saleData.length
  }
}
