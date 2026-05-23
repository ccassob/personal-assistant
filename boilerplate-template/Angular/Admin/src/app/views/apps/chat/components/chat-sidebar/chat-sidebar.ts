import { generateInitials } from '@/app/utils/string'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Optional, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbActiveOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { contactData, ContactType } from '../../data'

@Component({
  selector: 'app-chat-sidebar',
  imports: [RouterLink, NgbOffcanvasModule, SimplebarAngularModule, FormsModule, Icon, CommonModule],
  templateUrl: './chat-sidebar.html',
  styles: ``,
})
export class ChatSidebar {
  searchText: string = ''

  @Input() activeChatId = ''
  @Output() select = new EventEmitter<string>()

  contactData = contactData
  currentContact: ContactType | null

  constructor(@Optional() public activeOffcanvas: NgbActiveOffcanvas) {
    this.currentContact = contactData[0] || null
  }

  selectChat(id: string) {
    this.currentContact = contactData.find((u) => u.id === id) || null
    this.select.emit(id)
  }

  getFilteredUsers(): ContactType[] {
    if (!this.searchText) return contactData
    const keyword = this.searchText.toLowerCase()
    return contactData.filter((user) => user.name.toLowerCase().includes(keyword))
  }

  protected readonly generateInitials = generateInitials
}
