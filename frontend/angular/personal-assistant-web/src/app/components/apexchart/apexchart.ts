import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { ApexAxisChartSeries, ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-apexchart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './apexchart.html',
  styles: ``,
})
export class Apexchart implements OnInit {
  @Input() getOptions!: () => ApexOptions
  @ViewChild('chart') chart!: ChartComponent
  options: ReturnType<any>

  layout = inject(LayoutService)

  private layoutSub!: Subscription

  ngOnInit(): void {
    this.options = this.getOptions()

    // refresh chart on theme and skin change
    this.layoutSub = this.layout.layoutState$.subscribe((state) => {
      const skin = state.skin
      const theme = state.theme
      this.options = this.getOptions()
    })
  }

  ngOnDestroy(): void {
    this.layoutSub?.unsubscribe()
  }

  updateSeries(series: ApexAxisChartSeries) {
    this.chart?.updateSeries(series, true)
  }
}
