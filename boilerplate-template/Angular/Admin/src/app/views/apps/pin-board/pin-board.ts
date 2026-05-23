import { Component, inject, TemplateRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { pinNoteData } from './data'

@Component({
  selector: 'app-pin-board',
  imports: [PageBreadcrumb, RouterLink, Icon],
  templateUrl: './pin-board.html',
  styles: ``,
})
export class PinBoard {
  pinNoteData = pinNoteData
  private modalService = inject(NgbModal)

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'md', centered: true })
  }

  deletePin(id: string) {
    this.pinNoteData = this.pinNoteData.filter((item) => item.id !== id)
  }
}
