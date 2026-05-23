import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, TemplateRef } from '@angular/core'
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { SidebarContent } from './components/sidebar-content/sidebar-content'

@Component({
  selector: 'app-sidebar',
  imports: [SidebarContent, SimplebarAngularModule],
  templateUrl: './sidebar.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Sidebar {
  private offcanvasService = inject(NgbOffcanvas)

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      panelClass: 'asidebar border-start overflow-hidden',
      position: 'end',
    })
  }
}
