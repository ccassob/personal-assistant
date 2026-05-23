import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { StatisticsCardType } from '../../data'

@Component({
  selector: 'app-statistics-card',
  imports: [Icon, RouterLink],
  templateUrl: './statistics-card.html',
  styles: ``,
})
export class StatisticsCard {
  @Input() item!: StatisticsCardType
}
