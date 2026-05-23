import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { UserRoleCard } from './components/user-role-card/user-role-card'
import { UserTable } from './components/user-table/user-table'
import { memberRoleData } from './data'

@Component({
  selector: 'app-roles',
  imports: [UserRoleCard, UserTable, Icon, RouterLink, PageBreadcrumb],
  templateUrl: './roles.html',
  styles: ``,
})
export class Roles {
  memberRoleData = memberRoleData
}
