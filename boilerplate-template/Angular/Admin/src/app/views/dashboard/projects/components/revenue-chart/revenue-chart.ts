import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { revenueChartOptions } from '../../data'

@Component({
  selector: 'app-revenue-chart',
  imports: [RouterLink, CountUpDirective, Echart],
  templateUrl: './revenue-chart.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RevenueChart {
  revenueChartOptions = revenueChartOptions
}
