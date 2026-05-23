import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { EChartsType } from 'echarts/core'
import { areaChart, data, dynamicArea, dynamicChart, marker, randomData, stackedArrea, stepArea } from './data'

@Component({
  selector: 'app-area',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './area.html',
  styles: ``,
})
export class Area {
  areaChart = areaChart
  stackedArrea = stackedArrea
  marker = marker
  dynamicArea = dynamicArea
  stepArea = stepArea
  dynamicChart = dynamicChart
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
          series: [
            {
              data: [...data],
            },
          ],
        })
      }
    }, 1000)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
