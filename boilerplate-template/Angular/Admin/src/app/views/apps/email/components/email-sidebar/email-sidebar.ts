import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { SimplebarAngularModule } from 'simplebar-angular'

type LabelType = {
  name: string
  className: string
}

type EmailSidebarType = {
  label: string
  icon: string
  href: string
  badge?: {
    className: string
    text: string
  }
}

@Component({
  selector: 'app-email-sidebar',
  imports: [RouterLink, SimplebarAngularModule, Icon, CommonModule],
  templateUrl: './email-sidebar.html',
  styles: ``,
})
export class EmailSidebar {
  labelData: LabelType[] = [
    { name: 'Business', className: 'text-primary' },
    { name: 'Personal', className: 'text-secondary' },
    { name: 'Friends', className: 'text-info' },
    { name: 'Family', className: 'text-warning' },
  ]

  emailSidebarData: EmailSidebarType[] = [
    {
      label: 'Inbox',
      icon: 'inbox',
      href: '/apps/email/inbox',
      badge: { className: 'bg-danger-subtle text-danger', text: '21' },
    },
    {
      label: 'Sent',
      icon: 'send-2',
      href: '',
    },
    {
      label: 'Starred',
      icon: 'star',
      href: '',
    },
    {
      label: 'Scheduled',
      icon: 'clock',
      href: '',
    },
    {
      label: 'Drafts',
      icon: 'pencil',
      href: '',
      badge: { className: 'bg-secondary-subtle text-secondary', text: '9' },
    },
    {
      label: 'Important',
      icon: 'alert-circle',
      href: '',
    },
    {
      label: 'Spam',
      icon: 'ban',
      href: '',
    },
    {
      label: 'Trash',
      icon: 'trash',
      href: '',
    },
  ]
}
