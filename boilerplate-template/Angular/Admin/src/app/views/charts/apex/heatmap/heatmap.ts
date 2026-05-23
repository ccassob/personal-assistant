import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { colorRangeHeatmapChart, multipleSeriesHeatmapChart, rangeWithoutShadesHeatmapChart, singleSeriesHeatmapChart } from './data'

@Component({
  selector: 'app-heatmap',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './heatmap.html',
  styles: ``,
})
export class Heatmap {
  singleSeriesHeatmapChart = singleSeriesHeatmapChart
  multipleSeriesHeatmapChart = multipleSeriesHeatmapChart
  colorRangeHeatmapChart = colorRangeHeatmapChart
  rangeWithoutShadesHeatmapChart = rangeWithoutShadesHeatmapChart
}
