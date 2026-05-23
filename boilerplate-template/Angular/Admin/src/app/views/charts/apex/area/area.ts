import { META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'ng-apexcharts'
import { basicAreaChart, datetimeAreaChart, negativeAreaChart, nullValueAreaChart, splineAreaChart, stackedAreaChart, timeSeriesAreaChart } from './data'

@Component({
  selector: 'app-area',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './area.html',
  styles: ``,
})
export class Area {
  name = META_DATA.name
  basicAreaChart = basicAreaChart
  splineAreaChart = splineAreaChart
  negativeAreaChart = negativeAreaChart
  stackedAreaChart = stackedAreaChart
  timeSeriesAreaChart = timeSeriesAreaChart
  nullValueAreaChart = nullValueAreaChart

  selectedRange: string = '1Y'
  fullData: [number, number][] = []

  getDatetimeChartOptions = (): ApexOptions => {
    const options = datetimeAreaChart()

    const series = options.series?.[0]
    if (series && Array.isArray((series as any).data)) {
      this.fullData = (series as { data: [number, number][] }).data
    }

    return {
      ...options,
      chart: {
        ...(options.chart || {}),
        id: 'datetimeAreaChart',
        type: 'area',
        animations: { enabled: true },
      },
    }
  }

  updateChart(range: string): void {
    this.selectedRange = range

    const now = this.fullData[this.fullData.length - 1][0]
    const nowDate = new Date(now)
    let fromDate: Date

    switch (range) {
      case '1M':
        fromDate = new Date(nowDate)
        fromDate.setMonth(nowDate.getMonth() - 1)
        break
      case '6M':
        fromDate = new Date(nowDate)
        fromDate.setMonth(nowDate.getMonth() - 6)
        break
      case '1Y':
        fromDate = new Date(nowDate)
        fromDate.setFullYear(nowDate.getFullYear() - 1)
        break
      case 'YTD':
        fromDate = new Date(nowDate.getFullYear(), 0, 1)
        break
      case 'ALL':
      default:
        fromDate = new Date(this.fullData[0][0])
    }

    const filteredData = this.fullData.filter(([timestamp]) => {
      return timestamp >= fromDate.getTime()
    })

    ApexCharts.exec('datetimeAreaChart', 'updateSeries', [
      {
        name: META_DATA.name,
        data: filteredData,
      },
    ])
  }
}
