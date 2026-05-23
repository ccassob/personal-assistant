import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component, inject, TemplateRef } from '@angular/core'
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-offcanvas',
  imports: [PageBreadcrumb, Icon],
  templateUrl: './offcanvas.html',
  styles: ``,
})
export class Offcanvas {
  private offcanvasService = inject(NgbOffcanvas)

  openStart(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.dismiss()
    this.offcanvasService.open(content, { position: 'start' })
  }

  openEnd(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'end' })
  }

  openTop(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'top' })
  }

  openBottom(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'bottom' })
  }

  openNoBackdrop(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { backdrop: false, scroll: true })
  }

  openScroll(scroll: TemplateRef<any>) {
    this.offcanvasService.open(scroll, { scroll: true })
  }

  openDark(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'start', panelClass: 'text-bg-dark' })
  }
}
