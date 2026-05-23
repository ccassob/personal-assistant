import { Echart } from '@/app/components/echart/echart'
import { echarts } from '@/app/config/echart-config'
import { getColor } from '@/app/utils/string'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { EChartsOption } from 'echarts'
import { EChartsType } from 'echarts/core'

@Component({
  selector: 'app-svg-scatter-map',
  imports: [Echart],
  templateUrl: './svg-scatter-map.html',
  styles: ``,
})
export class SvgScatterMap implements OnInit, OnDestroy {
  ready = false
  private chart!: EChartsType

  private readonly scatterData = [
    [488.2358421078053, 459.70913833075736, 100],
    [770.3415644319939, 757.9672194986475, 30],
    [1180.0329284196291, 743.6141808346214, 80],
    [894.03790632245, 1188.1985153835008, 61],
    [1372.98925630313, 477.3839988649537, 70],
    [1378.62251255796, 935.6708486282843, 81],
  ]

  ngOnInit(): void {
    fetch('assets/images/svg/iceland.svg')
      .then((res) => res.text())
      .then((svg) => {
        echarts.registerMap('iceland', { svg })
        this.ready = true
      })
  }

  ngOnDestroy(): void {
    this.chart?.dispose()
  }

  onChartReady(chart: EChartsType): void {
    this.chart = chart

    chart.on('selectchanged', (rawParams) => {
      const params = rawParams as {
        selected: { seriesIndex: number; dataIndex: number[] }[]
      }

      if (!params.selected.length) {
        chart.dispatchAction({ type: 'hideTip' })
        chart.dispatchAction({ type: 'geoSelect', geoIndex: 0 })
      } else {
        const idx = params.selected[0].dataIndex[0]
        const name = this.scatterData[idx][2]
        chart.dispatchAction({
          type: 'geoSelect',
          geoIndex: 0,
          name,
        })
        chart.dispatchAction({
          type: 'showTip',
          geoIndex: 0,
          name,
        })
      }
    })
  }

  getOptions = (): EChartsOption => {
    return {
      tooltip: {},
      geo: {
        map: 'iceland',
        layoutCenter: ['50%', '50%'],
        layoutSize: '125%',
        roam: true,
        tooltip: {
          show: true,
          backgroundColor: getColor('secondary-bg'),
          borderColor: getColor('border-color'),
          textStyle: { color: getColor('light-text-emphasis') },
        },
      },
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          geoIndex: 0,
          symbolSize: (params: number[]) => (params[2] / 100) * 15 + 5,
          itemStyle: {
            color: '#b02a02',
          },
          encode: {
            tooltip: 2,
          },
          data: this.scatterData,
        },
      ],
    }
  }
}
