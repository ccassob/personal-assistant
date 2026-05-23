import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component, inject, TemplateRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-layout',
  imports: [PageBreadcrumb, Icon, RouterLink],
  templateUrl: './layout.html',
  styles: ``,
})
export class Layout {
  private modalService = inject(NgbModal)

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' })
  }
}
