import { Component, inject, TemplateRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbCollapseModule, NgbOffcanvas, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { EmailSidebar } from '../components/email-sidebar/email-sidebar'
import { actionData, toolbarData } from './data'

@Component({
  selector: 'app-details',
  imports: [PageBreadcrumb, SimplebarAngularModule, EmailSidebar, NgbTooltipModule, RouterLink, NgbCollapseModule, Icon],
  templateUrl: './details.html',
  styles: ``,
})
export class Details {
  isCollapsed1: boolean = true
  isCollapsed2: boolean = true
  isCollapsed3: boolean = false
  isEmailReplyCollapsed: boolean = true
  actionData = actionData
  toolbarData = toolbarData

  private offcanvasService = inject(NgbOffcanvas)

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'outlook-left-menu outlook-left-menu-sm' })
  }
}
