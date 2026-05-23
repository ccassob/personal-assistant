import { Echart } from '@/app/components/echart/echart'
import { echarts } from '@/app/config/echart-config'
import { getColor } from '@/app/utils/string'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { EChartsOption } from 'echarts'
import { EChartsType } from 'echarts/core'

@Component({
  selector: 'app-world-map',
  imports: [Echart],
  templateUrl: './world-map.html',
  styles: ``,
})
export class WorldMap implements OnInit, OnDestroy {
  private chartInstance!: EChartsType
  ready = false
  getOptions = (): EChartsOption => ({
    tooltip: {
      trigger: 'item',
      padding: [7, 10],
      backgroundColor: getColor('secondary-bg'),
      borderColor: getColor('border-color'),
      textStyle: { color: getColor('light-text-emphasis') },
      borderWidth: 1,
      transitionDuration: 0,
      formatter: '{b}',
    },
    textStyle: {
      fontFamily: getComputedStyle(document.body).fontFamily,
    },
    series: [
      {
        type: 'map',
        map: 'world',
        roam: true,
        scaleLimit: { min: 1, max: 5 },
        left: 0,
        right: 0,
        label: { show: false },
        itemStyle: {
          borderColor: getColor('border-color'),
          areaColor: getColor('chart-primary'),
        },
        emphasis: {
          label: { show: false },
          itemStyle: { areaColor: getColor('chart-gamma') },
        },
      },
    ],
  })
  ngOnInit(): void {
    fetch('assets/data/world_geo.json')
      .then((res) => {
        return res.json()
      })
      .then((geoJson) => {
        echarts.registerMap('world', geoJson)
        this.ready = true
      })
      .catch(console.error)
  }

  onChartReady(chart: EChartsType): void {
    this.chartInstance = chart
    chart.getDom().addEventListener('click', () => {
      chart.dispatchAction({ type: 'restore' })
    })
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose()
  }
}
