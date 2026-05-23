import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { CountUpDirective } from 'ngx-countup'
import { StatisticCard3Type } from '../../data'

@Component({
  selector: 'app-statistic-card3',
  imports: [CountUpDirective],
  templateUrl: './statistic-card3.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard3 {
  @Input() item!: StatisticCard3Type
  Number = Number
}
