import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'

type MessageItemType = {
  name: string
  image?: string
  icon?: string
  action: string
  context: string
  time: string
  active?: boolean
}

@Component({
  selector: 'simple-messages-dropdown',
  imports: [RouterLink, Icon, NgbDropdownModule, SimplebarAngularModule],
  template: `
    <div id="simple-messages-dropdown" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button ngbDropdownToggle class="topbar-link drop-arrow-none" type="button">
          <app-icon icon="mail" class="topbar-link-icon"></app-icon>
          <span class="badge text-bg-success badge-circle topbar-badge">7</span>
        </button>

        <div ngbDropdownMenu class="p-0 dropdown-menu-end dropdown-menu-lg">
          <div class="px-3 py-2 border-bottom">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0 fs-md fw-semibold">Messages</h6>
              </div>
              <div class="col text-end">
                <a [routerLink]="[]" class="badge badge-soft-success badge-label py-1">09 Notifications</a>
              </div>
            </div>
          </div>

          <ngx-simplebar style="max-height: 300px">
            @for (message of messageData; track $index; let i = $index) {
              <div ngbDropdownItem class="notification-item py-2 text-wrap" [class.active]="message.active" [id]="'message-' + i">
                <span class="d-flex gap-3">
                  @if (message.icon) {
                    <span class="avatar-md flex-shrink-0">
                      <span class="avatar-title text-bg-info rounded-circle fs-22">
                        <app-icon [icon]="message.icon" class="fs-22"></app-icon>
                      </span>
                    </span>
                  }
                  @if (message.image) {
                    <span class="flex-shrink-0">
                      <img [src]="message.image" class="avatar-md rounded-circle" alt="User Avatar" />
                    </span>
                  }
                  <span class="flex-grow-1 text-muted">
                    <span class="fw-medium text-body">{{ message.name }}</span>
                    {{ message.action }}
                    <span class="fw-medium text-body">{{ message.context }}</span>
                    <br />
                    <span class="fs-xs">{{ message.time }}</span>
                  </span>
                  <button type="button" class="flex-shrink-0 text-muted btn btn-link p-0" (click)="removeMessage(i)">
                    <app-icon icon="square-rounded-x" class="fs-xxl"></app-icon>
                  </button>
                </span>
              </div>
            }
          </ngx-simplebar>

          <!-- All-->
          <a [routerLink]="[]" ngbDropdownItem class=" text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">Read All Messages</a>
        </div>
      </div>
      <!-- end dropdown-->
    </div>
  `,
  styles: ``,
})
export class SimpleMessagesDropdown {
  messageData: MessageItemType[] = [
    {
      name: 'Liam Carter',
      image: user1,
      action: 'uploaded a new document to',
      context: 'Project Phoenix',
      time: '5 minutes ago',
      active: true,
    },
    {
      name: 'Ava Mitchell',
      image: user2,
      action: 'commented on',
      context: 'Marketing Campaign Q3',
      time: '12 minutes ago',
    },
    {
      name: 'Noah Blake',
      icon: 'user-hexagon',
      action: 'updated the status of',
      context: 'Client Onboarding',
      time: '30 minutes ago',
    },
    {
      name: 'Sophia Taylor',
      image: user4,
      action: 'sent an invoice for',
      context: 'Service Renewal',
      time: '1 hour ago',
    },
    {
      name: 'Ethan Moore',
      image: user5,
      action: 'completed the task',
      context: 'UI Review',
      time: '2 hours ago',
    },
    {
      name: 'Olivia White',
      image: user6,
      action: 'assigned you a task in',
      context: 'Sales Pipeline',
      time: 'Yesterday',
    },
  ]
  removeMessage(index: number): void {
    this.messageData.splice(index, 1)
  }
}
