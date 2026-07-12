import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

type NotificationType = {
  icon: string
  iconClassName: string
  message: string
  time: string
}

@Component({
  selector: 'notification-dropdown-alert',
  imports: [RouterLink, Icon, SimplebarAngularModule, NgbDropdownModule],
  template: `
    <div id="notification-dropdown-alert" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button class="topbar-link dropdown-toggle drop-arrow-none" ngbDropdownToggle type="button">
          <app-icon icon="bell" class="topbar-link-icon"></app-icon>
          <span class="badge badge-square text-bg-warning topbar-badge">12</span>
        </button>

        <div ngbDropdownMenu class="p-0 dropdown-menu-end dropdown-menu-lg">
          <div class="px-3 py-2 border-bottom">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0 fs-md fw-semibold">Notifications</h6>
              </div>
              <div class="col text-end">
                <a [routerLink]="[]" class="badge text-bg-light badge-label py-1">12 Alerts</a>
              </div>
            </div>
          </div>

          <ngx-simplebar style="max-height: 300px">
            @for (item of notificationData; track item.message; let i = $index) {
              <div ngbDropdownItem class="notification-item py-2 text-wrap">
                <span class="d-flex gap-2">
                  <span class="avatar-md flex-shrink-0">
                    <span class="avatar-title rounded {{ item.iconClassName }}">
                      <app-icon [icon]="item.icon" class="notification-item-icon"></app-icon>
                    </span>
                  </span>

                  <span class="flex-grow-1 text-muted">
                    <span class="fw-medium text-body">{{ item.message }}</span>
                    <br />
                    <span class="fs-xs">{{ item.time }}</span>
                  </span>

                  <button type="button" class="flex-shrink-0 text-muted btn btn-link p-0" (click)="removeMessage(i)">
                    <app-icon icon="square-rounded-x" class="fs-xxl"></app-icon>
                  </button>
                </span>
              </div>
            }
          </ngx-simplebar>
          <!-- end dropdown-->

          <!-- All-->
          <a [routerLink]="[]" ngbDropdownItem class="text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">View All Alerts</a>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class NotificationDropdownAlert {
  notificationData: NotificationType[] = [
    {
      icon: 'server-bolt',
      iconClassName: 'bg-danger-subtle text-danger',
      message: 'Critical alert: Server crash detected',
      time: '30 minutes ago',
    },
    {
      icon: 'alert-triangle',
      iconClassName: 'bg-warning-subtle text-warning',
      message: 'High memory usage on Node A',
      time: '10 minutes ago',
    },
    {
      icon: 'circle-check',
      iconClassName: 'bg-success-subtle text-success',
      message: 'Backup completed successfully',
      time: '1 hour ago',
    },
    {
      icon: 'user-plus',
      iconClassName: 'bg-primary-subtle text-primary',
      message: 'New user registration: Sarah Miles',
      time: 'Just now',
    },
    {
      icon: 'bug',
      iconClassName: 'bg-danger-subtle text-danger',
      message: 'Bug reported in payment module',
      time: '20 minutes ago',
    },
    {
      icon: 'message-circle',
      iconClassName: 'bg-info-subtle text-info',
      message: 'New comment on Task #142',
      time: '15 minutes ago',
    },
    {
      icon: 'battery-charging',
      iconClassName: 'bg-warning-subtle text-warning',
      message: 'Low battery on Device X',
      time: '45 minutes ago',
    },
    {
      icon: 'cloud-upload',
      iconClassName: 'bg-success-subtle text-success',
      message: 'File upload completed',
      time: '1 hour ago',
    },
    {
      icon: 'calendar',
      iconClassName: 'bg-primary-subtle text-primary',
      message: 'Team meeting scheduled at 3 PM',
      time: '2 hours ago',
    },
    {
      icon: 'download',
      iconClassName: 'bg-secondary-subtle text-secondary',
      message: 'Report ready for download',
      time: '3 hours ago',
    },
    {
      icon: 'lock',
      iconClassName: 'bg-danger-subtle text-danger',
      message: 'Multiple failed login attempts',
      time: '5 hours ago',
    },
    {
      icon: 'bell-ringing',
      iconClassName: 'bg-info-subtle text-info',
      message: 'Reminder: Submit your timesheet',
      time: 'Today, 9:00 AM',
    },
  ]
  removeMessage(index: number): void {
    this.notificationData.splice(index, 1)
  }
}
