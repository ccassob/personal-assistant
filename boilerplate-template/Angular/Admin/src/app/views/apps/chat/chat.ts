import { generateInitials } from '@/app/utils/string'
import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbDropdownModule, NgbOffcanvas, NgbOffcanvasModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularComponent, SimplebarAngularModule } from 'simplebar-angular'
import { ChatSidebar } from './components/chat-sidebar/chat-sidebar'
import { ChatThreadType, contactData, ContactType, currentUser, messageThreadData } from './data'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [PageBreadcrumb, ChatSidebar, SimplebarAngularModule, FormsModule, ReactiveFormsModule, NgbOffcanvasModule, NgbTooltipModule, NgbDropdownModule, RouterLink, Icon, CommonModule],
  templateUrl: './chat.html',
})
export class Chat implements OnInit, AfterViewInit {
  currentThread: ChatThreadType | null = null
  currentContact!: ContactType
  currentUser: ContactType = {} as ContactType
  activeChatId = ''
  chatForm: FormGroup
  submitted = false
  currentMessage = ''

  @ViewChild('simplebarRef', { static: false })
  simplebarRef!: SimplebarAngularComponent

  constructor(
    private offcanvasService: NgbOffcanvas,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.currentUser = currentUser
    this.currentContact = contactData[0]
    this.activeChatId = this.currentContact.id
    this.loadThread(this.activeChatId)
  }

  ngAfterViewInit(): void {
    this.scrollToBottom()
  }

  loadThread(contactId: string) {
    this.currentThread = messageThreadData.find((t) => t.participants.some((p) => p.id === contactId)) || null

    const contact = contactData.find((c) => c.id === contactId)
    if (contact) this.currentContact = contact

    setTimeout(() => this.scrollToBottom(), 100)
  }

  scrollToBottom() {
    if (this.simplebarRef) {
      const scrollEl = this.simplebarRef.SimpleBar.getScrollElement()
      scrollEl.scrollTop = scrollEl.scrollHeight
    }
  }

  sendMessage() {
    this.submitted = true
    const messageControl = this.chatForm.get('message')

    if (!messageControl || messageControl.invalid) {
      this.chatForm.markAllAsTouched()
      return
    }

    const messageText = messageControl.value.trim()
    if (!messageText) return

    messageThreadData.forEach((thread) => {
      if (thread.participants.some((p) => p.id === this.activeChatId)) {
        thread.messages.push({
          id: Date.now().toString(),
          senderId: this.currentUser.id,
          text: messageText,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })
        this.simulateIncomingMessage(this.activeChatId)
      }
    })

    this.loadThread(this.activeChatId)
    this.chatForm.reset()
    this.submitted = false

    setTimeout(() => this.scrollToBottom(), 100)
  }

  getChatById(chatId: string) {
    return messageThreadData.find((chat) => chat.participants.some((p) => p.id === chatId))
  }

  simulateIncomingMessage(chatId: string) {
    const chat = this.getChatById(chatId)
    if (!chat) return

    const responses = ["Can't chat, calls only", '😑😑😑', '👍', 'Thanks!', 'Talk soon.', 'No worries 😄']

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()

    const reply = {
      id: Date.now().toString(),
      senderId: this.currentContact.id,
      text: responses[Math.floor(Math.random() * responses.length)],
      time,
    }

    setTimeout(
      () => {
        chat.messages.push(reply)

        if (this.activeChatId === chatId) {
          this.currentThread = chat
          this.cdr.detectChanges()
          this.scrollToBottom()
        }
      },
      Math.random() * 2000 + 1000
    )
  }

  openSidebar(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      panelClass: 'outlook-left-menu outlook-left-menu-lg',
    })
  }

  selectChat(contactId: string) {
    this.activeChatId = contactId
    this.loadThread(contactId)
  }

  get activeUser(): ContactType | undefined {
    return contactData.find((u) => u.id === this.activeChatId)
  }

  protected readonly generateInitials = generateInitials
}
