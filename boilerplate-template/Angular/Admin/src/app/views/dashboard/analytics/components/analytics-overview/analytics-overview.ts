import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { CountUpDirective } from 'ngx-countup'
import { analyticChartOptions, overviewData } from '../../data'

@Component({
  selector: 'app-analytics-overview',
  imports: [CountUpDirective, RouterLink, Apexchart],
  templateUrl: './analytics-overview.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsOverview {
  Number = Number
  overviewData = overviewData
  analyticChartOptions = analyticChartOptions
}
