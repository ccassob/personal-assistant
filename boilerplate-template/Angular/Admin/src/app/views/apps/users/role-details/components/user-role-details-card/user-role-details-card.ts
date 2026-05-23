import { Component, inject, TemplateRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-user-role-details-card',
  imports: [Icon, RouterLink, NgbDropdownModule],
  templateUrl: './user-role-details-card.html',
  styles: ``,
})
export class UserRoleDetailsCard {
  private modalService = inject(NgbModal)

  editRoleModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' })
  }
}
