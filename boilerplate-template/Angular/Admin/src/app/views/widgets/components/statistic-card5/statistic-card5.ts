import { toPascalCase } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { CountUpDirective } from 'ngx-countup'
import { StatisticCard5Type } from '../../data'

@Component({
  selector: 'app-statistic-card5',
  imports: [RouterLink, CountUpDirective, NgbProgressbarModule],
  templateUrl: './statistic-card5.html',
  styles: ``,
})
export class StatisticCard5 {
  @Input() item!: StatisticCard5Type
  Number = Number
  protected readonly toPascalCase = toPascalCase
}
