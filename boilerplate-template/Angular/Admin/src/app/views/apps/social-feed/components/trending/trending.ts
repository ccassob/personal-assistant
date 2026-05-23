import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { trendingData } from '../../data'

@Component({
  selector: 'app-trending',
  imports: [RouterLink, Icon, NgbDropdownModule],
  templateUrl: './trending.html',
  styles: ``,
})
export class Trending {
  trendingData = trendingData
}
