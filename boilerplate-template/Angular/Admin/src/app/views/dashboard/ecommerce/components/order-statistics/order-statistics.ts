import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Echart } from '@app/components/echart/echart'
import { NgbNavModule, NgbProgressbar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { orderStatisticData, orderStatisticsChartOptions } from '../../data'

@Component({
  selector: 'app-order-statistics',
  imports: [RouterLink, NgbNavModule, NgbTooltip, Echart, NgbProgressbar],
  templateUrl: './order-statistics.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderStatistics {
  activeTab = 'monthly'
  orderStatisticsChartOptions = orderStatisticsChartOptions
  orderStatisticData = orderStatisticData
  Math = Math
}
