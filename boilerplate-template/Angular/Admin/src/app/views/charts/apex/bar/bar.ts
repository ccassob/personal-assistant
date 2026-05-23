import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { barWithMarkersChart, basicBarChart, dataLabelsBarChart, fullStackedBarChart, groupedBarChart, groupedStackedBarChart, imageFillBarChart, negativeBarChart, patternBarChart, reversedBarChart, stackedBarChart } from './data'

@Component({
  selector: 'app-bar',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './bar.html',
  styles: ``,
})
export class Bar {
  basicBarChart = basicBarChart
  groupedBarChart = groupedBarChart
  stackedBarChart = stackedBarChart
  fullStackedBarChart = fullStackedBarChart
  groupedStackedBarChart = groupedStackedBarChart
  negativeBarChart = negativeBarChart
  reversedBarChart = reversedBarChart
  imageFillBarChart = imageFillBarChart
  dataLabelsBarChart = dataLabelsBarChart
  patternBarChart = patternBarChart
  barWithMarkersChart = barWithMarkersChart
}
