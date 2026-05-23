import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { candlestickWithLineChart, comboBarCandlestickChart, comboCandlestickChart, simpleCandlestickChart, xAxisCandlestickChart } from './data'

@Component({
  selector: 'app-candlestick',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './candlestick.html',
  styles: ``,
})
export class Candlestick {
  simpleCandlestickChart = simpleCandlestickChart
  xAxisCandlestickChart = xAxisCandlestickChart
  candlestickWithLineChart = candlestickWithLineChart
  comboCandlestickChart = comboCandlestickChart
  comboBarCandlestickChart = comboBarCandlestickChart
}
