import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbOffcanvas, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { EmailSidebar } from '../components/email-sidebar/email-sidebar'
import { actionData, emailData } from './data'

@Component({
  selector: 'app-inbox',
  imports: [PageBreadcrumb, SimplebarAngularModule, EmailSidebar, NgbTooltipModule, FormsModule, Icon, RouterLink],
  templateUrl: './inbox.html',
  styles: ``,
})
export class Inbox {
  searchTerm: string = ''
  private offcanvasService = inject(NgbOffcanvas)

  actionData = actionData
  emailData = emailData
  filteredEmails = [...emailData]
  selectedIds = new Set<number>()
  selectAll = false

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'outlook-left-menu outlook-left-menu-sm' })
  }

  /** Search emails dynamically */
  onSearch(term: string) {
    const lowerTerm = term.toLowerCase()
    this.filteredEmails = term ? this.emailData.filter((email) => email.user.name.toLowerCase().includes(lowerTerm) || email.subject.toLowerCase().includes(lowerTerm) || email.snippet.toLowerCase().includes(lowerTerm)) : [...this.emailData]

    this.selectedIds.clear()
    this.selectAll = false
  }

  toggleSingleSelection(i: number) {
    if (this.selectedIds.has(i)) {
      this.selectedIds.delete(i)
    } else {
      this.selectedIds.add(i)
    }

    this.selectAll = this.filteredEmails.every((_, index) => this.selectedIds.has(index))
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll

    if (this.selectAll) {
      this.selectedIds = new Set(this.filteredEmails.map((_, index) => index))
    } else {
      this.selectedIds.clear()
    }
  }
}
