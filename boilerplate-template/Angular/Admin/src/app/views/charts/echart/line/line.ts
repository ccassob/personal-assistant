import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { EChartsType } from 'echarts/core'
import { data, getLineChartOptions, lineCategory, lineCharts, lineMarker, lineStacked, randomData, stepLine } from './data'

@Component({
  selector: 'app-line',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './line.html',
  styles: ``,
})
export class Line {
  lineCharts = lineCharts
  lineStacked = lineStacked
  lineMarker = lineMarker
  stepLine = stepLine
  lineCategory = lineCategory
  getLineChartOptions = getLineChartOptions

  private chartInstance!: EChartsType
  private intervalId!: ReturnType<typeof setInterval>

  onChartReady(chart: EChartsType): void {
    this.chartInstance = chart
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        data.shift()
        data.push(randomData())
      }

      if (this.chartInstance) {
        this.chartInstance.setOption({
          series: [{ data: [...data] }],
        })
      }
    }, 1000)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
