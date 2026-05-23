import { Component, Input } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { StatisticsWithChartType } from '../../data'

@Component({
  selector: 'app-statistic-widget-chart-right',
  imports: [CountUpDirective, Echart],
  templateUrl: './statistic-widget-chart-right.html',
  styles: ``,
})
export class StatisticWidgetChartRight {
  @Input() item!: StatisticsWithChartType
}
