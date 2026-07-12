import { echarts } from '@/app/config/echart-config'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { LayoutService } from '@core/services/layout.service'
import { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-echart',
  imports: [NgxEchartsDirective, CommonModule],
  templateUrl: './echart.html',
  providers: [provideEchartsCore({ echarts })],
  styles: ``,
})
export class Echart implements OnInit, OnDestroy {
  @Input() getOptions!: () => EChartsOption
  @Input() height: string = '300px'
  @Input() width: string = 'auto'
  @Output() chartInit = new EventEmitter<EChartsType>()

  options!: EChartsOption

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

  onChartInit(instance: EChartsType) {
    this.chartInit.emit(instance)
  }
}
