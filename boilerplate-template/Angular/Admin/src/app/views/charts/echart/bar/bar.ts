import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { EChartsType } from 'echarts/core'
import { barChart, barGradiant, BarRaceChart, data, horizontalBar, horizontalStacked, mixedBar, negative, progressBar, stacked, timelineBar, twoBar, withSeries } from './data'

@Component({
  selector: 'app-bar',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './bar.html',
  styles: ``,
})
export class Bar {
  barChart = barChart
  twoBar = twoBar
  progressBar = progressBar
  horizontalBar = horizontalBar
  negative = negative
  withSeries = withSeries
  stacked = stacked
  horizontalStacked = horizontalStacked
  barGradiant = barGradiant
  mixedBar = mixedBar
  timelineBar = timelineBar
  BarRaceChart = BarRaceChart

  private chartInstance!: EChartsType
  private intervalId!: ReturnType<typeof setInterval>

  onChartReady(chart: EChartsType): void {
    this.chartInstance = chart
  }

  ngOnInit(): void {
    setTimeout(() => this.run(), 0)
    this.intervalId = setInterval(() => this.run(), 3000)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }

  run(): void {
    for (let i = 0; i < data.length; ++i) {
      data[i] += Math.round(Math.random() * (Math.random() > 0.9 ? 2000 : 200))
    }

    if (this.chartInstance) {
      this.chartInstance.setOption({
        series: [
          {
            type: 'bar',
            data: [...data],
          },
        ],
      })
    }
  }
}
