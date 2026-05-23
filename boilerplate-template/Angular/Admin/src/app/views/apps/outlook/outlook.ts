import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbNavModule, NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { OutlookNav } from './components/outlook-nav/outlook-nav'
import { messageData } from './data'

@Component({
  selector: 'app-outlook',
  imports: [PageBreadcrumb, OutlookNav, SimplebarAngularModule, Icon, NgbOffcanvasModule, NgbNavModule],
  templateUrl: './outlook.html',
  styles: ``,
})
export class Outlook {
  messageData = messageData
  activeId: string = messageData[1].id
  navReady = false
  constructor(private cdr: ChangeDetectorRef) {}

  @ViewChild('content', { static: true }) contentRef!: TemplateRef<any>

  @ViewChild(OutlookNav) set navSetter(nav: OutlookNav) {
    if (nav && !this.navReady) {
      this.navComponent = nav
      this.navReady = true
      this.cdr.detectChanges()
    }
  }
  navComponent!: OutlookNav
  private offcanvasService = inject(NgbOffcanvas)

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'outlook-left-menu', position: 'start' })
  }
}
