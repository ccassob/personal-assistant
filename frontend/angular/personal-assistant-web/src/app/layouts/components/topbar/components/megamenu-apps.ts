import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

type AppMenuItemType = {
  icon: string
  iconClassName: string
  title: string
  subtitle: string
  href: string
}

@Component({
  selector: 'megamenu-apps',
  imports: [NgbDropdownModule, Icon, SimplebarAngularModule, RouterLink],
  template: `
    <div id="megamenu-apps" class="topbar-item d-none d-md-flex">
      <div ngbDropdown>
        <button ngbDropdownToggle class="topbar-link btn fw-medium btn-link drop-arrow-none" type="button">
          Apps
          <app-icon icon="chevron-down" class="ms-1"></app-icon>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-xxl p-0">
          <ngx-simplebar class="h-100" style="max-height: 380px;">
            <div class="row g-0">
              <div class="col-sm-8">
                <div class="row g-0">
                  @for (column of chunkedApps; track $index; let colIndex = $index) {
                    <div class="col-sm-6">
                      <div class="p-2">
                        @for (item of column; track $index; let i = $index) {
                          <a [routerLink]="[]" ngbDropdownItem [class]="[i === 0 ? 'mt-0' : '', i === column.length - 1 ? 'mt-2' : 'my-2']">
                            <span class="d-flex align-items-center">
                              <span class="avatar-md me-2">
                                <span class="avatar-title border border-light bg-light bg-opacity-50 rounded" [class]="item.iconClassName">
                                  <app-icon [icon]="item.icon" class="fs-22"></app-icon>
                                </span>
                              </span>
                              <span>
                                <h5 class="fs-14 mb-0 lh-base">{{ item.title }}</h5>
                                <span class="text-muted fs-12">{{ item.subtitle }}</span>
                              </span>
                            </span>
                          </a>
                        }
                      </div>
                    </div>
                  }
                </div>

                <div class="row g-0 border-top border-light border-dashed text-center">
                  <div class="col">
                    <div class="p-3">
                      <p class="fw-medium text-muted mb-2 fs-11 text-uppercase lh-1">-: &nbsp; Support &nbsp;:-</p>
                      <h5 class="fs-15 mb-0">help@mydomain.com</h5>
                    </div>
                  </div>
                  <div class="col">
                    <div class="p-3">
                      <p class="fw-medium text-muted mb-2 fs-11 text-uppercase lh-1">-: &nbsp; Help: &nbsp;:-</p>
                      <h5 class="fs-15 mb-0">+(12) 3456 7890</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-sm-4">
                <div class="h-100 position-relative rounded-end rounded-0 overflow-hidden" style="background: url(assets/images/stock/small-8.jpg); background-size: cover">
                  <div class="p-3 card-img-overlay bg-gradient bg-secondary bg-opacity-90 d-flex align-items-center justify-content-center">
                    <div class="text-center text-white">
                      <app-icon icon="atom" class="fs-36"></app-icon>
                      <p class="text-white text-opacity-75 mb-3 text-uppercase">Limited Offer</p>
                      <h3 class="fw-semibold text-white mb-2 fs-20">Unlock Exclusive Savings</h3>
                      <h4 class="fw-medium fs-16 mb-1">
                        <del class="text-opacity-75 text-white">$49.00</del>
                        /
                        <span class="fw-bold text-white">$25 USD</span>
                      </h4>
                      <button type="button" class="btn btn-danger btn-sm mt-3">
                        <app-icon icon="shopping-cart" class="me-1"></app-icon>
                        Grab Deal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ngx-simplebar>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class MegamenuApps {
  chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  appsMenuData: AppMenuItemType[] = [
    {
      icon: 'basket',
      iconClassName: 'text-primary',
      title: 'eCommerce',
      subtitle: 'Products, orders & etc.',
      href: '',
    },
    {
      icon: 'message',
      iconClassName: 'text-success',
      title: 'Chat',
      subtitle: 'Team conversations',
      href: '',
    },
    {
      icon: 'list-check',
      iconClassName: 'text-danger',
      title: 'Task',
      subtitle: 'Plan and track work',
      href: '',
    },
    {
      icon: 'mailbox',
      iconClassName: 'text-info',
      title: 'Email',
      subtitle: 'Messages and inbox',
      href: '',
    },
    {
      icon: 'building',
      iconClassName: 'text-secondary',
      title: 'Companies',
      subtitle: 'Business profiles',
      href: '',
    },
    {
      icon: 'id',
      iconClassName: 'text-dark',
      title: 'Contacts Diary',
      subtitle: 'People and connections',
      href: '',
    },
    {
      icon: 'calendar',
      iconClassName: 'text-warning',
      title: 'Calendar',
      subtitle: 'Events and reminders',
      href: '',
    },
    {
      icon: 'lifebuoy',
      iconClassName: 'text-success',
      title: 'Support',
      subtitle: 'Help and assistance',
      href: '',
    },
  ]

  chunkedApps = this.chunkArray(this.appsMenuData, 4)
}
