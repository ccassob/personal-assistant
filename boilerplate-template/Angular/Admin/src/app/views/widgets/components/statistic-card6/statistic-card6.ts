import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { CountUpDirective } from 'ngx-countup'
import { StatisticCard6Type } from '../../data'

@Component({
  selector: 'app-statistic-card6',
  imports: [CountUpDirective],
  templateUrl: './statistic-card6.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard6 {
  @Input() item!: StatisticCard6Type
  Number = Number
}
