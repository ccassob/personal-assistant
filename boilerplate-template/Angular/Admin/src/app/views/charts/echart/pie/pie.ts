import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { doughnutPie, edgeAlign, labelAlign, multiplePie, nightingaleMap, pieChart, roundedPie } from './data'

@Component({
  selector: 'app-pie',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './pie.html',
  styles: ``,
})
export class Pie {
  pieChart = pieChart
  doughnutPie = doughnutPie
  roundedPie = roundedPie
  multiplePie = multiplePie
  labelAlign = labelAlign
  nightingaleMap = nightingaleMap
  edgeAlign = edgeAlign
}
