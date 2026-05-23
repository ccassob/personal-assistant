import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { getOrderChartOptions } from '../../data'

@Component({
  selector: 'app-orders-card',
  imports: [CountUpDirective, Echart],
  templateUrl: './orders-card.html',
  styles: ``,
})
export class OrdersCard {
  getOrderChartOptions = getOrderChartOptions
}
