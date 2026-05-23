import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { CountUpDirective } from 'ngx-countup'
import { StatisticCard4Type } from '../../data'

@Component({
  selector: 'app-statistic-card4',
  imports: [CountUpDirective],
  templateUrl: './statistic-card4.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard4 {
  @Input() item!: StatisticCard4Type
  Number = Number
}
