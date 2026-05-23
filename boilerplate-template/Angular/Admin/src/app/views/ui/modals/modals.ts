import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgbModal, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-modals',
  imports: [PageBreadcrumb, Icon, NgbModalModule, FormsModule, RouterLink],
  templateUrl: './modals.html',
  styles: ``,
})
export class Modals {
  private modalService = inject(NgbModal)

  name: string = ''

  open(content: TemplateRef<any>) {
    this.modalService.open(content)
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    this.modalService.open(content, options)
  }

  openvaryingModal(content: TemplateRef<HTMLElement>, name: string) {
    this.modalService.open(content)
    this.name = name
  }
  modalTitle: string = 'Default Modal Title'

  openModals(content: TemplateRef<HTMLElement>, options: NgbModalOptions, title?: string) {
    if (title) {
      this.modalTitle = title
    }
    this.modalService.open(content, options)
  }
}
