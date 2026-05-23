import { Component } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { EChartsType } from 'echarts/core'
import { interval, Subscription } from 'rxjs'
import { gaugeChart, gaugeData, MultiGaugeChart, multiRing, ringGauge, stageChart, temperature } from './data'

@Component({
  selector: 'app-gauge',
  imports: [PageBreadcrumb, Echart],
  templateUrl: './gauge.html',
  styles: ``,
})
export class Gauge {
  private chartInstance!: EChartsType
  private stageChartInstance!: EChartsType
  private temperatureChartInstance!: EChartsType

  // Interval and subscription
  private subscription!: Subscription
  private intervalId!: ReturnType<typeof setInterval>
  private tempIntervalId!: ReturnType<typeof setInterval>

  // Chart configs
  gaugeChart = gaugeChart
  stageChart = stageChart
  ringGauge = ringGauge
  temperature = temperature
  multiRing = multiRing
  MultiGaugeChart = MultiGaugeChart

  ngOnInit(): void {
    // 1. Auto-update stageChart every 2s
    this.subscription = interval(2000).subscribe(() => {
      if (this.stageChartInstance) {
        this.stageChartInstance.setOption({
          series: [{ data: [{ value: +(Math.random() * 100).toFixed(2) }] }],
        })
      }
    })

    // 2. Auto-update main gaugeChart every 2s
    this.intervalId = setInterval(() => {
      gaugeData[0].value = +(Math.random() * 100).toFixed(2)
      gaugeData[1].value = +(Math.random() * 100).toFixed(2)
      gaugeData[2].value = +(Math.random() * 100).toFixed(2)

      if (this.chartInstance) {
        this.chartInstance.setOption({
          series: [{ data: [...gaugeData] }],
        })
      }
    }, 2000)

    // 3. Auto-update temperature chart every 2s
    this.tempIntervalId = setInterval(() => {
      const randomTemp = +(Math.random() * 60).toFixed(2)
      if (this.temperatureChartInstance) {
        this.temperatureChartInstance.setOption({
          series: [{ data: [{ value: randomTemp }] }, { data: [{ value: randomTemp }] }],
        })
      }
    }, 2000)
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
    clearInterval(this.tempIntervalId)
    this.subscription?.unsubscribe()
  }

  // Capture chart instances
  onChartInit(ec: EChartsType) {
    this.stageChartInstance = ec
  }

  onChartReady(chart: EChartsType): void {
    this.chartInstance = chart
  }

  onTemperatureChartInit(chart: EChartsType): void {
    this.temperatureChartInstance = chart
  }
}
