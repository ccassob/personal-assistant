import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CountUpDirective } from 'ngx-countup'

@Component({
  selector: 'app-statistic-card2',
  imports: [RouterLink, CountUpDirective],
  templateUrl: './statistic-card2.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticCard2 {}
