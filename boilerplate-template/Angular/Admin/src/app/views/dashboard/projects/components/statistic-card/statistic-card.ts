import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CountUpDirective } from 'ngx-countup'
import { StatisticType } from '../../data'

@Component({
  selector: 'app-statistic-card',
  imports: [RouterLink, CountUpDirective],
  templateUrl: './statistic-card.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard {
  @Input() item!: StatisticType
  Number = Number
}
