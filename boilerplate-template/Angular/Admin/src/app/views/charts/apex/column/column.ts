import { Component, OnInit } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import ApexCharts from 'apexcharts'
import { ApexAxisChartSeries, ApexOptions } from 'ng-apexcharts'
import {
  basicColumnChart,
  columnWithGroupLabelChart,
  columnWithMarkersChart,
  datalabelsColumnChart,
  distributedColumnChart,
  dumbbellChart,
  fullStackedColumnChart,
  groupedStackedColumnChart,
  negativeValueColumnChart,
  rangeColumnChart,
  rotateLabelsColumnChart,
  stackedColumnChart,
} from './data'

type QuarterData = {
  x: string
  y: number
}
type YearData = {
  x: string
  y: number
  colorToken: string
  quarters: QuarterData[]
}
type SourceChart = {
  w: {
    globals: {
      selectedDataPoints: number[][]
      labels: string[]
      seriesNames: string[]
    }
    config: {
      series: { data: YearData[] }[]
    }
  }
}

@Component({
  selector: 'app-column',
  imports: [PageBreadcrumb, Apexchart],
  templateUrl: './column.html',
  styles: ``,
})
export class Column implements OnInit {
  basicColumnChart = basicColumnChart
  datalabelsColumnChart = datalabelsColumnChart
  stackedColumnChart = stackedColumnChart
  fullStackedColumnChart = fullStackedColumnChart
  groupedStackedColumnChart = groupedStackedColumnChart
  dumbbellChart = dumbbellChart
  columnWithMarkersChart = columnWithMarkersChart
  columnWithGroupLabelChart = columnWithGroupLabelChart
  rotateLabelsColumnChart = rotateLabelsColumnChart
  negativeValueColumnChart = negativeValueColumnChart
  distributedColumnChart = distributedColumnChart
  rangeColumnChart = rangeColumnChart

  isQuarterChartActive = false

  private yearData: YearData[] = []

  ngOnInit() {
    this.yearData = this.makeData()
  }

  private ins(token: string): string {
    return token === 'primary' ? '#6658dd' : token === 'secondary' ? '#4a81d4' : token === 'info' ? '#43bfe5' : token === 'danger' ? '#f1556c' : token === 'warning' ? '#f7b84b' : token === 'success' ? '#1abc9c' : token === 'border-color' ? '#e7e9eb' : '#000000'
  }

  arrayData = [
    {
      y: 400,
      quarters: [
        { x: 'Q1', y: 120 },
        { x: 'Q2', y: 90 },
        { x: 'Q3', y: 100 },
        { x: 'Q4', y: 90 },
      ],
      colorToken: 'primary',
    },
    {
      y: 430,
      quarters: [
        { x: 'Q1', y: 120 },
        { x: 'Q2', y: 110 },
        { x: 'Q3', y: 90 },
        { x: 'Q4', y: 110 },
      ],
      colorToken: 'secondary',
    },
    {
      y: 448,
      quarters: [
        { x: 'Q1', y: 70 },
        { x: 'Q2', y: 100 },
        { x: 'Q3', y: 140 },
        { x: 'Q4', y: 138 },
      ],
      colorToken: 'info',
    },
    {
      y: 470,
      quarters: [
        { x: 'Q1', y: 150 },
        { x: 'Q2', y: 60 },
        { x: 'Q3', y: 190 },
        { x: 'Q4', y: 70 },
      ],
      colorToken: 'danger',
    },
    {
      y: 540,
      quarters: [
        { x: 'Q1', y: 120 },
        { x: 'Q2', y: 120 },
        { x: 'Q3', y: 130 },
        { x: 'Q4', y: 170 },
      ],
      colorToken: 'warning',
    },
    {
      y: 580,
      quarters: [
        { x: 'Q1', y: 170 },
        { x: 'Q2', y: 130 },
        { x: 'Q3', y: 120 },
        { x: 'Q4', y: 160 },
      ],
      colorToken: 'success',
    },
  ]

  shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  makeData() {
    const dataSet = this.shuffleArray(this.arrayData)
    return dataSet.map((item, index) => ({
      x: ` ${2019 + index}`,
      y: item.y,
      colorToken: item.colorToken,
      quarters: item.quarters,
    }))
  }

  updateQuarterChart(sourceChart: SourceChart): void {
    const series: ApexAxisChartSeries = []
    const colors: string[] = []
    const seriesIndex = 0

    const selectedPoints = sourceChart.w.globals.selectedDataPoints
    if (selectedPoints[0] && selectedPoints[0].length > 0) {
      for (const selectedIndex of selectedPoints[seriesIndex]) {
        const yearSeries = sourceChart.w.config.series[seriesIndex]
        const selectedItem = yearSeries.data[selectedIndex]

        series.push({
          name: selectedItem.x,
          data: selectedItem.quarters,
          color: this.ins(selectedItem.colorToken),
        })

        colors.push(this.ins(selectedItem.colorToken))
      }
    } else {
      series.push({ data: [] })
    }
    ApexCharts.exec('barQuarter', 'updateOptions', {
      series: series,
      colors: colors,
      fill: { colors: colors },
    })
  }

  yearColumnChart: () => ApexOptions = () => {
    const data = this.yearData
    const resolvedColors = data.map((d) => this.ins(d.colorToken))

    return {
      series: [{ data: data }],
      chart: {
        id: 'barYear',
        type: 'bar',
        height: 400,
        events: {
          dataPointSelection: (e, chart, opts) => {
            const points = opts.selectedDataPoints[0]
            if (points.length === 1) {
              this.isQuarterChartActive = true
              this.updateQuarterChart(chart)
            } else if (points.length > 1) {
              this.updateQuarterChart(chart)
            } else {
              this.isQuarterChartActive = false
              this.updateQuarterChart(chart)
            }
          },
          updated: (chart) => {
            if (chart.w.globals.selectedDataPoints[0] && chart.w.globals.selectedDataPoints[0].length > 0) {
              this.updateQuarterChart(chart)
              this.isQuarterChartActive = true
            } else {
              this.isQuarterChartActive = false
            }
          },
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: '75%',
          dataLabels: { position: 'bottom' },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: true,
        style: { colors: ['#fff'] },
        formatter: (val, opt) => opt.w.globals.labels[opt.dataPointIndex],
        offsetX: 10,
        dropShadow: { enabled: true },
      },
      colors: resolvedColors,
      states: {
        normal: { filter: { type: 'desaturate' } },
        active: {
          allowMultipleDataPointsSelection: true,
          filter: { type: 'darken', value: 1 },
        },
      },
      tooltip: {
        x: { show: false },
        y: {
          title: {
            formatter: (val, opts) => opts.w.globals.labels[opts.dataPointIndex],
          },
        },
      },
      title: {
        text: 'Yearly Results',
        offsetX: 5,
        style: { fontSize: '14px', fontWeight: 700 },
      },
      subtitle: {
        text: '(Click on bar to see details)',
        offsetX: 5,
        style: { fontSize: '12px', fontWeight: 500 },
      },
      xaxis: { axisBorder: { show: false } },
      yaxis: { labels: { show: false } },
      grid: {
        borderColor: this.ins('chart-order-color'),
        padding: { top: -10, right: 0, bottom: -15, left: 0 },
      },
    }
  }

  quaterChart: () => ApexOptions = () => ({
    series: [{ data: [] }],
    chart: {
      id: 'barQuarter',
      height: 400,
      width: '100%',
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        horizontal: false,
      },
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    title: {
      text: 'Quarterly Results',
      offsetX: 10,
      style: {
        fontSize: '14px',
        fontWeight: 700,
      },
    },
    tooltip: {
      x: {
        formatter: function (val, opts) {
          return opts.w.globals.seriesNames[opts.seriesIndex]
        },
      },
      y: {
        title: {
          formatter: function (val, opts) {
            return opts.w.globals.labels[opts.dataPointIndex]
          },
        },
      },
    },
  })

  updateQuarter() {
    const updatedData = this.makeData()
    ApexCharts.exec('barYear', 'updateSeries', [{ data: updatedData }])
    ApexCharts.exec('barYear', 'toggleDataPointSelection')
    ApexCharts.exec('barQuarter', 'updateSeries', [{ data: [] }])
    this.isQuarterChartActive = false
  }
}
