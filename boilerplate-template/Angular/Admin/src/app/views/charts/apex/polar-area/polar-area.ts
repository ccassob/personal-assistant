import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicPolarAreaChart, monochromePolarAreaChart } from './data'

@Component({
  selector: 'app-polar-area',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './polar-area.html',
  styles: ``,
})
export class PolarArea {
  monochromePolarAreaChart = monochromePolarAreaChart
  basicPolarAreaChart = basicPolarAreaChart
}
