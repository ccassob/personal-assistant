import { Component, Input } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { StatisticsWithChartType } from '../../data'

@Component({
  selector: 'app-statistic-widget-chart-left',
  imports: [CountUpDirective, Echart],
  templateUrl: './statistic-widget-chart-left.html',
  styles: ``,
})
export class StatisticWidgetChartLeft {
  @Input() item!: StatisticsWithChartType
}
