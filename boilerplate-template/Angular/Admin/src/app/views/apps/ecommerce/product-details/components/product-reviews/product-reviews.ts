import { toPascalCase } from '@/app/utils/string'
import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CustomPagination } from '@app/components/custom-pagination/custom-pagination'
import { Icon } from '@app/components/icon/icon'
import { Rating } from '@app/components/rating/rating'
import { NgbSortableHeader } from '@core/directive/sortable.directive'
import { TableService } from '@core/services/table.service'
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { ReviewType, reviewData } from '../../data'

@Component({
  selector: 'app-product-reviews',
  imports: [Icon, NgbProgressbar, Rating, RouterLink, CustomPagination, CommonModule, NgbSortableHeader],
  providers: [TableService],
  templateUrl: './product-reviews.html',
  styles: ``,
})
export class ProductReviews implements OnInit {
  userReviews$: Observable<ReviewType[]>
  total$: Observable<number>

  constructor(public tableService: TableService<ReviewType>) {
    this.userReviews$ = this.tableService.items$
    this.total$ = this.tableService.total$
  }

  ngOnInit(): void {
    this.tableService.setItems(reviewData, 5)
  }

  reviews: { progress: number; count: number }[] = [
    {
      progress: 85,
      count: 128,
    },
    {
      progress: 10,
      count: 37,
    },
    {
      progress: 3,
      count: 15,
    },
    {
      progress: 1,
      count: 7,
    },
    {
      progress: 1,
      count: 2,
    },
  ]
  protected readonly toPascalCase = toPascalCase
}
