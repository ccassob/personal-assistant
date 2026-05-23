import { Echart } from '@/app/components/echart/echart'
import { echarts } from '@/app/config/echart-config'
import { getColor } from '@/app/utils/string'
import { Component, OnInit } from '@angular/core'
import { EChartsOption, PieSeriesOption, registerMap } from 'echarts'
import { EChartsType } from 'echarts/core'

@Component({
  selector: 'app-pie-chart-with-map',
  imports: [Echart],
  templateUrl: './pie-chart-with-map.html',
  styles: ``,
})
export class PieChartWithMap implements OnInit {
  ready = false
  private chart!: EChartsType

  ngOnInit(): void {
    fetch('assets/data/usa_geo.json')
      .then((res) => res.json())
      .then((usaGeoJson) => {
        registerMap('USA', usaGeoJson, {
          Alaska: { left: -131, top: 25, width: 15 },
          Hawaii: { left: -112, top: 25, width: 5 },
          'Puerto Rico': { left: -76, top: 26, width: 2 },
        })
        this.ready = true
      })
  }

  onChartReady(chart: EChartsType): void {
    this.chart = chart
  }

  getOptions = (): EChartsOption => {
    const randomPieSeries = (center: [number, number] | string, radius: number): PieSeriesOption => {
      const data = ['A', 'B', 'C', 'D'].map((t) => {
        return {
          value: Math.round(Math.random() * 100),
          name: 'Category ' + t,
        }
      })
      return {
        type: 'pie',
        coordinateSystem: 'geo',
        tooltip: {
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: getColor('secondary-bg'),
          borderColor: getColor('border-color'),
          textStyle: { color: getColor('light-text-emphasis') },
        },
        label: { show: false },
        labelLine: { show: false },
        animationDuration: 0,
        radius,
        center,
        data,
      }
    }

    const version = +echarts.version.split('.').slice(0, 3).join('')
    const centerMaine: [number, number] | string = version > 540 ? 'Maine' : [-69, 45.5]

    return {
      geo: {
        map: 'USA',
        roam: true,
        itemStyle: {
          borderColor: getColor('border-color'),
          areaColor: getColor('chart-secondary'),
        },
        label: { color: '#fff' },
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: { areaColor: getColor('chart-gamma') },
        },
      },
      tooltip: {
        backgroundColor: getColor('secondary-bg'),
        borderColor: getColor('border-color'),
        textStyle: { color: getColor('light-text-emphasis') },
      },
      legend: {
        textStyle: { color: '#858d98' },
      },
      series: [randomPieSeries([-86.753504, 33.01077], 15), randomPieSeries([-116.853504, 39.8], 25), randomPieSeries([-99, 31.5], 30), randomPieSeries(centerMaine, 12)] as PieSeriesOption[],
    }
  }
}
