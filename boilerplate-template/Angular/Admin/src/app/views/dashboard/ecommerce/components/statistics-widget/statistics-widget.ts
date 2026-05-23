import { Component, Input } from '@angular/core'
import { Echart } from '@app/components/echart/echart'
import { CountUpDirective } from 'ngx-countup'
import { StatisticsWidgetType } from '../../data'

@Component({
  selector: 'app-statistics-widget',
  imports: [Echart, CountUpDirective],
  templateUrl: './statistics-widget.html',
  styles: ``,
})
export class StatisticsWidget {
  Number = Number
  @Input() item!: StatisticsWidgetType
}
