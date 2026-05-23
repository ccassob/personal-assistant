import { toPascalCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Rating } from '@app/components/rating/rating'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { getReviewChartOptions, productReviewData, ProductReviewType, ratingData } from './data'

@Component({
  selector: 'app-reviews',
  imports: [PageBreadcrumb, FormsModule, AsyncPipe, Icon, RouterLink, NgbDropdownModule, CustomPagination, NgbSortableHeader, Rating, Apexchart],
  providers: [TableService],
  templateUrl: './reviews.html',
  styles: ``,
})
export class Reviews {
  getReviewChartOptions = getReviewChartOptions
  productReviewData = productReviewData
  ratingData = ratingData

  selectAll = false
  selectedIds = new Set<string>()
  productReviewData$: Observable<ProductReviewType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ProductReviewType>) {
    this.productReviewData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(structuredClone(productReviewData), 5)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.productReviewData.forEach((exp) => this.selectedIds.add(exp.product.name))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: ProductReviewType) {
    if (this.selectedIds.has(product.product.name)) {
      this.selectedIds.delete(product.product.name)
    } else {
      this.selectedIds.add(product.product.name)
    }
    this.selectAll = this.selectedIds.size === this.productReviewData.length
  }

  deleteSelected() {
    this.productReviewData = this.productReviewData.filter((exp) => !this.selectedIds.has(exp.product.name))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(structuredClone(this.productReviewData), 5)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }

  protected readonly toPascalCase = toPascalCase
}
