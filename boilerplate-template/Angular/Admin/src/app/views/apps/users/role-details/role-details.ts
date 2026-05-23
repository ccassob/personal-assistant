import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { UserRoleDetailsCard } from './components/user-role-details-card/user-role-details-card'
import { UserRoleDetailsTable } from './components/user-role-details-table/user-role-details-table'

@Component({
  selector: 'app-role-details',
  imports: [NgbDropdownModule, UserRoleDetailsCard, UserRoleDetailsTable, PageBreadcrumb],
  templateUrl: './role-details.html',
  styles: ``,
})
export class RoleDetails {}
