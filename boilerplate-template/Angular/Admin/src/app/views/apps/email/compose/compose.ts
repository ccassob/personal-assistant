import { initQuillIcons } from '@/app/utils/quill-icons-init'
import { Component, inject, TemplateRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbCollapseModule, NgbDropdownModule, NgbOffcanvas, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { QuillEditorComponent } from 'ngx-quill'
import { SimplebarAngularModule } from 'simplebar-angular'
import { EmailSidebar } from '../components/email-sidebar/email-sidebar'

@Component({
  selector: 'app-compose',
  imports: [PageBreadcrumb, SimplebarAngularModule, NgbCollapseModule, QuillEditorComponent, FormsModule, NgbDropdownModule, NgbTooltip, EmailSidebar, Icon],
  templateUrl: './compose.html',
  styles: ``,
})
export class Compose {
  isCollapsed = true
  isCollapsed2 = true

  private offcanvasService = inject(NgbOffcanvas)

  editorContent: string = `
  <p>Hi <strong><em>James</em></strong>,</p>
                        <p>I hope you're doing well.</p>
                        <p>I'm reaching out regarding the latest updates on our project. Please find the summary below:</p>
                        <ul>
                            <li>All UI components have been reviewed and finalized.</li>
                            <li>The mobile responsiveness is now optimized across all breakpoints.</li>
                            <li>We’re awaiting final client feedback before deployment.</li>
                        </ul>
                        <p>Let me know if you need anything else or if there's anything you'd like us to adjust.</p>
                        <p><br></p>
                        <p>Best regards,</p>
                        <p><em>Damian</em></p>`

  editorConfig = {
    toolbar: [[{ header: [false, 1, 2, 3, 4, 5, 6] }], ['bold', 'italic', 'underline', 'strike'], [{ color: [] }, { background: [] }], ['blockquote', 'code-block'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image', 'video']],
  }

  constructor() {
    initQuillIcons()
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { panelClass: 'outlook-left-menu outlook-left-menu-sm' })
  }
}
