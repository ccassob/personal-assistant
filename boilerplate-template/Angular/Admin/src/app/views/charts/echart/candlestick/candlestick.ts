import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicCandle, mixedCandle } from './data'

@Component({
  selector: 'app-candlestick',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './candlestick.html',
  styles: ``,
})
export class Candlestick {
  basicCandle = basicCandle
  mixedCandle = mixedCandle
}
