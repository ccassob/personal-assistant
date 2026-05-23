import { META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-user-card',
  imports: [RouterLink, Icon, NgbDropdownModule],
  templateUrl: './user-card.html',
  styles: ``,
})
export class UserCard {
  username = META_DATA.username
}
