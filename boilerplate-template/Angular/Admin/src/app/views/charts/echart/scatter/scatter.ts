import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { bubbleChart, quarterChart, scatterChart, singleAxis } from './data'

@Component({
  selector: 'app-scatter',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './scatter.html',
  styles: ``,
})
export class Scatter {
  scatterChart = scatterChart
  bubbleChart = bubbleChart
  quarterChart = quarterChart
  singleAxis = singleAxis
}
