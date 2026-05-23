import { toTitleCase } from '@/app/utils/string'
import { AsyncPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Rating } from '@app/components/rating/rating'
import { TableService } from '@core/services/table.service'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { productData, ProductType } from '../../data'

@Component({
  selector: 'app-product-inventory',
  imports: [RouterLink, CustomPagination, NgbDropdownModule, Rating, AsyncPipe],
  providers: [TableService],
  templateUrl: './product-inventory.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductInventory {
  protected readonly toTitleCase = toTitleCase
  productData$: Observable<ProductType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ProductType>) {
    this.productData$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(productData, 5)
  }
}
