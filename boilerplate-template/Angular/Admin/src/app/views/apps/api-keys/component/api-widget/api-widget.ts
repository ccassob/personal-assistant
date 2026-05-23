import { Component, Input } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { Icon } from '@app/components/icon/icon'
import { ApiStatisticsType } from '../../data'

@Component({
  selector: 'app-api-widget',
  imports: [Icon, Apexchart],
  templateUrl: './api-widget.html',
  styles: ``,
})
export class ApiWidget {
  @Input() item!: ApiStatisticsType
}
