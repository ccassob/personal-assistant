import { toTitleCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { orderData, OrderType } from '../../data'

@Component({
  selector: 'app-recent-orders',
  imports: [RouterLink, AsyncPipe, CustomPagination, NgbDropdownModule],
  providers: [TableService],
  templateUrl: './recent-orders.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecentOrders {
  protected readonly toTitleCase = toTitleCase
  orderData$: Observable<OrderType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<OrderType>) {
    this.orderData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(orderData, 5)
  }
}
