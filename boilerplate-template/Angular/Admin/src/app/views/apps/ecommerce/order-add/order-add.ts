import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { FlatpickrDirective } from 'angularx-flatpickr'

@Component({
  selector: 'app-order-add',
  imports: [PageBreadcrumb, FlatpickrDirective],
  templateUrl: './order-add.html',
  styles: ``,
})
export class OrderAdd {
  flatPickrOptions = {
    dateFormat: 'F j, Y',
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }
}
