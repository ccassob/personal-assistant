import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { brushChartMain, brushChartOverview, dashedLineChart, gradientLineChart, lineChart, lineWithAnnotationsChart, lineWithDataLabelChart, missingDataLineChart, RealtimeLineChart, stepLineChart, syncChartPrimary, syncChartSecondary, zoomableLineChart } from './data'

@Component({
  selector: 'app-line',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './line.html',
  styles: ``,
})
export class Line {
  lineChart = lineChart
  lineWithDataLabelChart = lineWithDataLabelChart
  zoomableLineChart = zoomableLineChart
  lineWithAnnotationsChart = lineWithAnnotationsChart
  syncChartPrimary = syncChartPrimary
  syncChartSecondary = syncChartSecondary
  gradientLineChart = gradientLineChart
  missingDataLineChart = missingDataLineChart
  dashedLineChart = dashedLineChart
  stepLineChart = stepLineChart
  brushChartMain = brushChartMain
  brushChartOverview = brushChartOverview
  RealtimeLineChart = RealtimeLineChart
}
