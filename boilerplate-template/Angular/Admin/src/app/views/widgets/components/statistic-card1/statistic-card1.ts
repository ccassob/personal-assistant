import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { StatisticCard1Type } from '../../data'

@Component({
  selector: 'app-statistic-card1',
  imports: [],
  templateUrl: './statistic-card1.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard1 {
  @Input() item!: StatisticCard1Type
}
