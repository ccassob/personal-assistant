import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { browserChart, customizeChart, multipleChart, RadarChart } from './data'

@Component({
  selector: 'app-radar',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './radar.html',
  styles: ``,
})
export class Radar {
  radarChart = RadarChart
  browserChart = browserChart
  customizeChart = customizeChart
  multipleChart = multipleChart
}
