import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { FlatpickrDirective } from 'angularx-flatpickr'

@Component({
  selector: 'app-create',
  imports: [PageBreadcrumb, RouterLink, FlatpickrDirective, Icon],
  templateUrl: './create.html',
  styles: ``,
})
export class Create {
  flatPickrOptions = {
    dateFormat: 'Y-m-d',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }
}
