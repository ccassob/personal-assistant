import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { NgbNav, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { messageData } from '../../data'

@Component({
  selector: 'app-outlook-nav',
  imports: [NgbTooltipModule, NgbNavModule, SimplebarAngularModule, Icon],
  templateUrl: './outlook-nav.html',
  styles: ``,
})
export class OutlookNav {
  messageData = messageData

  @Input() activeId!: string
  @Output() activeIdChange = new EventEmitter<string>()
  @ViewChild('nav', { static: true }) nav!: NgbNav

  ngOnInit() {
    if (!this.activeId && this.messageData.length > 0) {
      this.activeId = this.messageData[0].id
    }
  }

  onNavChange(newId: string) {
    this.activeId = newId
    this.activeIdChange.emit(newId)
  }
}
