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
import { Observable } from 'rxjs'
import { sellerData, SellerType } from './data'

@Component({
  selector: 'app-sellers',
  imports: [PageBreadcrumb, RouterLink, Icon, CustomPagination, FormsModule, NgbSortableHeader, Rating, Apexchart, AsyncPipe],
  providers: [TableService],
  templateUrl: './sellers.html',
  styles: ``,
})
export class Sellers {
  selectAll = false
  selectedIds = new Set<string>()
  sellerData = sellerData

  sellerData$: Observable<SellerType[]>
  total$: Observable<number>
  filterOrders: string = 'All'
  filterRevenue: string = 'All'
  filterRating: string = 'All'

  constructor(public tableService: TableService<SellerType>) {
    this.sellerData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(sellerData, 8)
  }

  toggleAllSelection(checked: boolean) {
    this.selectAll = checked
    if (checked) {
      this.sellerData.forEach((seller) => this.selectedIds.add(seller.seller.name))
    } else {
      this.selectedIds.clear()
    }
  }

  toggleSingleSelection(product: SellerType) {
    if (this.selectedIds.has(product.seller.name)) {
      this.selectedIds.delete(product.seller.name)
    } else {
      this.selectedIds.add(product.seller.name)
    }
    this.selectAll = this.selectedIds.size === this.sellerData.length
  }

  deleteSelected() {
    this.sellerData = this.sellerData.filter((seller) => !this.selectedIds.has(seller.seller.name))

    this.selectedIds.clear()
    this.selectAll = false

    this.tableService.setItems(this.sellerData, 8)
  }
  get hasSelection(): boolean {
    return this.selectedIds.size > 0
  }
}
