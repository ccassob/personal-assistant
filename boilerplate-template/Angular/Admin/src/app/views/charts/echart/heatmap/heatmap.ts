import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { basicHeatmapChart, heatMapChart, heatMapDataChart } from './data'

@Component({
  selector: 'app-heatmap',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './heatmap.html',
  styles: ``,
})
export class Heatmap {
  heatMapDataChart = heatMapDataChart
  heatMapChart = heatMapChart
  basicHeatmapChart = basicHeatmapChart
}
