import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import ApexCharts from 'apexcharts'
import { ApexOptions } from 'ng-apexcharts'
import { donutUpdateChart, gradientDonutChart, imagePieChart, monochromePieChart, patternedDonutChart, simpleDonutChart, simplePieChart } from './data'

@Component({
  selector: 'app-pie',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './pie.html',
  styles: ``,
})
export class Pie {
  simplePieChart = simplePieChart
  simpleDonutChart = simpleDonutChart
  monochromePieChart = monochromePieChart
  gradientDonutChart = gradientDonutChart
  patternedDonutChart = patternedDonutChart
  imagePieChart = imagePieChart
  donutUpdateChart = donutUpdateChart

  series: number[] = [44, 55, 13, 33]

  getDonutOptions: () => ApexOptions = () => ({
    ...donutUpdateChart(),
    chart: {
      ...(donutUpdateChart().chart || {}),
      id: 'donutUpdateChart',
      type: 'donut',
    },
    series: this.series,
  })
  randomizeChart() {
    this.series = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))
    this.updateSeries()
  }

  addData() {
    this.series = [...this.series, Math.floor(Math.random() * 100)]
    this.updateSeries()
  }

  removeData() {
    this.series = this.series.slice(0, -1)
    this.updateSeries()
  }

  resetChart() {
    this.series = [44, 55, 13, 33]
    this.updateSeries()
  }
  private updateSeries() {
    ApexCharts.exec('donutUpdateChart', 'updateSeries', this.series)
  }
}
