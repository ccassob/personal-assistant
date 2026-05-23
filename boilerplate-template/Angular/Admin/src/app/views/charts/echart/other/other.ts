import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { dottedChart, pieChart, subburstChart } from './data'

@Component({
  selector: 'app-other',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './other.html',
  styles: ``,
})
export class Other {
  dottedChart = dottedChart
  subburstChart = subburstChart
  pieChart = pieChart
}
