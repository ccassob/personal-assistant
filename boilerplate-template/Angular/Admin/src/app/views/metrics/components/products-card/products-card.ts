import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { getProductsChartOptions } from '../../data'

@Component({
  selector: 'app-products-card',
  imports: [CountUpDirective, Echart],
  templateUrl: './products-card.html',
  styles: ``,
})
export class ProductsCard {
  getProductsChartOptions = getProductsChartOptions
}
