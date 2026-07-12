import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
const google = 'assets/images/logos/google.svg'
const figma = 'assets/images/logos/figma.svg'
const slack = 'assets/images/logos/slack.svg'
const dropbox = 'assets/images/logos/dropbox.svg'

type AppType = {
  name: string
  href: string
  image?: string
  icon?: { name: string; className: string }
}

@Component({
  selector: 'apps-dropdown-rounded',
  imports: [Icon, RouterLink, NgbDropdownModule],
  template: `
    <div id="apps-dropdown-rounded" class="topbar-item">
      <div ngbDropdown placement="bottom-end" autoClose="outside">
        <button class="topbar-link drop-arrow-none" type="button" ngbDropdownToggle>
          <app-icon icon="apps" class="topbar-link-icon"></app-icon>
        </button>

        <div ngbDropdownMenu class="dropdown-menu-lg p-2 dropdown-menu-end">
          <div class="row align-items-center g-1">
            @for (item of appsData; track $index) {
              <div class="col-4">
                <a [routerLink]="item.href" class="rounded text-center py-2 d-flex flex-column" ngbDropdownItem>
                  <span class="avatar-sm d-block mx-auto mb-1">
                    @if (item.icon) {
                      <span class="avatar-title rounded-circle" [class]="item.icon.className">
                        <app-icon [icon]="item.icon.name" class="fs-18"></app-icon>
                      </span>
                    } @else {
                      <span class="avatar-title text-bg-light rounded-circle">
                        <img [src]="item.image" [alt]="item.name" height="18" />
                      </span>
                    }
                  </span>
                  <span class="align-middle fw-medium">{{ item.name }}</span>
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AppsDropdownRounded {
  appsData: AppType[] = [
    {
      name: 'Google',
      href: '',
      image: google,
    },
    {
      name: 'Figma',
      href: '',
      image: figma,
    },
    {
      name: 'Slack',
      href: '',
      image: slack,
    },
    {
      name: 'Dropbox',
      href: '',
      image: dropbox,
    },
    {
      name: 'Calendar',
      href: '',
      icon: {
        name: 'calendar',
        className: 'bg-primary-subtle text-primary',
      },
    },
    {
      name: 'Files',
      href: '',
      icon: {
        name: 'folder',
        className: 'bg-primary-subtle text-primary',
      },
    },
  ]
}
