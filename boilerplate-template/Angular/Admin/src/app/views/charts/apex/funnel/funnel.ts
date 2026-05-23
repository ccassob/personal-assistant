import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicFunnelChart, pyramidFunnelChart } from './data'

@Component({
  selector: 'app-funnel',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './funnel.html',
  styles: ``,
})
export class Funnel {
  basicFunnelChart = basicFunnelChart
  pyramidFunnelChart = pyramidFunnelChart
}
