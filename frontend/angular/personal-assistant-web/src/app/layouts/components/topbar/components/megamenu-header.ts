import { META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

type MegaMenuType = {
  title: string
  links: {
    label: string
    href: string
  }[]
}

@Component({
  selector: 'megamenu-header',
  imports: [NgbDropdownModule, Icon, SimplebarAngularModule, RouterLink],
  template: `
    <div id="megamenu-header" class="topbar-item d-none d-md-flex">
      <div ngbDropdown>
        <button ngbDropdownToggle class="topbar-link btn fw-medium btn-link drop-arrow-none" type="button">
          Mega Menu
          <app-icon icon="chevron-down" class="ms-1"></app-icon>
        </button>
        <div ngbDropdownMenu class="dropdown-menu-xxl p-0">
          <ngx-simplebar class="h-100" style="max-height: 380px;">
            <div class="row g-0">
              <div class="col-12">
                <div class="px-3 py-2 text-center bg-light bg-opacity-50">
                  <h4 class="mb-0 fs-lg fw-semibold">
                    Welcome to
                    <span class="text-primary">{{ name }}</span>
                    Admin Theme.
                  </h4>
                </div>
              </div>
            </div>
            <div class="row g-0">
              @for (item of megaMenuData; track $index) {
                <div class="col-md-4">
                  <div class="p-3">
                    <h5 class="mb-2 fw-semibold fs-sm dropdown-header">{{ item.title }}</h5>
                    <ul class="list-unstyled megamenu-list">
                      @for (link of item.links; track $index) {
                        <li>
                          <a [routerLink]="link.href" ngbDropdownItem>{{ link.label }}</a>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }
            </div>
          </ngx-simplebar>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class MegamenuHeader {
  name = META_DATA.name
  megaMenuData: MegaMenuType[] = [
    {
      title: 'Dashboard & Analytics',
      links: [
        { label: 'Sales Dashboard', href: '' },
        { label: 'Marketing Dashboard', href: '' },
        { label: 'Finance Overview', href: '' },
        { label: 'User Analytics', href: '' },
        { label: 'Traffic Insights', href: '' },
      ],
    },
    {
      title: 'Project Management',
      links: [
        { label: 'Task Overview', href: '' },
        { label: 'Kanban Board', href: '' },
        { label: 'Gantt Chart', href: '' },
        { label: 'Team Collaboration', href: '' },
        { label: 'Project Milestones', href: '' },
      ],
    },
    {
      title: 'User Management',
      links: [
        { label: 'User Profiles', href: '' },
        { label: 'Access Control', href: '' },
        { label: 'Role Permissions', href: '' },
        { label: 'Activity Logs', href: '' },
        { label: 'Security Settings', href: '' },
      ],
    },
  ]
}
