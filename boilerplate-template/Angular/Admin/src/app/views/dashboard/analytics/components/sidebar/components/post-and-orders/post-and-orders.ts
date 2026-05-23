import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { orderChartOptions, postChartOptions } from '../../../../data'

@Component({
  selector: 'app-post-and-orders',
  imports: [NgbNavModule, Apexchart],
  templateUrl: './post-and-orders.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostAndOrders {
  active = 2
  postChartOptions = postChartOptions
  orderChartOptions = orderChartOptions
}
