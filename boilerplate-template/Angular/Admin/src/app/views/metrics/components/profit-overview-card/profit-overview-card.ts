import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { getprofitChartOptions } from '../../data'

@Component({
  selector: 'app-profit-overview-card',
  imports: [CountUpDirective, Echart],
  templateUrl: './profit-overview-card.html',
  styles: ``,
})
export class ProfitOverviewCard {
  getprofitChartOptions = getprofitChartOptions
}
