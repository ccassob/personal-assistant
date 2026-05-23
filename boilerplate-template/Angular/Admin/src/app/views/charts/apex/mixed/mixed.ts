import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { allMixedChart, lineAreaChart, lineColumnChart, multiYAxisChart } from './data'

@Component({
  selector: 'app-mixed',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './mixed.html',
  styles: ``,
})
export class Mixed {
  lineColumnChart = lineColumnChart
  multiYAxisChart = multiYAxisChart
  lineAreaChart = lineAreaChart
  allMixedChart = allMixedChart
}
