import { Component, Input } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { StatisticCardType } from '../../data'

@Component({
  selector: 'app-statistic-widget',
  imports: [CountUpDirective, Echart],
  templateUrl: './statistic-widget.html',
  styles: ``,
})
export class StatisticWidget {
  @Input() item!: StatisticCardType
  Number = Number
}
