import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { MemberRoleType } from '../../data'

@Component({
  selector: 'app-user-role-card',
  imports: [Icon, RouterLink, NgbDropdownModule, NgbTooltip],
  templateUrl: './user-role-card.html',
  styles: ``,
})
export class UserRoleCard {
  @Input() role!: MemberRoleType
}
