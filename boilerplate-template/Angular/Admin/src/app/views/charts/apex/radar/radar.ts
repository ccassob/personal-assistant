import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import ApexCharts from 'apexcharts'
import { ApexOptions } from 'ng-apexcharts'
import { basicRadarChart, multiRadarChart, polygonRadarChart } from './data'

@Component({
  selector: 'app-radar',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './radar.html',
  styles: ``,
})
export class Radar {
  basicRadarChart = basicRadarChart
  polygonRadarChart = polygonRadarChart

  series = [
    { name: 'Marketing', data: [85, 70, 65, 90, 60, 75] },
    { name: 'Sales', data: [60, 80, 75, 55, 95, 70] },
    { name: 'IT', data: [78, 65, 80, 40, 60, 85] },
  ]

  getRadarOptions: () => ApexOptions = () => {
    const base = multiRadarChart()
    return {
      ...base,
      chart: {
        ...(base.chart || {}),
        id: 'updatableRadarChart',
        type: 'radar',
      },
      series: this.series,
    }
  }
  updateSeries() {
    const randomSeries = (): number[] => Array.from({ length: 6 }, () => Math.floor(Math.random() * 100))

    this.series = [
      { name: 'Marketing', data: randomSeries() },
      { name: 'Sales', data: randomSeries() },
      { name: 'IT', data: randomSeries() },
    ]

    ApexCharts.exec('updatableRadarChart', 'updateSeries', this.series)
  }
}
