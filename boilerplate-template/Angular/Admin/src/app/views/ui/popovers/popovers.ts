import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { toTitleCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-popovers',
  imports: [PageBreadcrumb, Icon, NgbPopoverModule],
  templateUrl: './popovers.html',
  styles: ``,
})
export class Popovers {
  popoverVariants = ['primary', 'success', 'danger', 'info', 'dark', 'secondary', 'purple']
  protected readonly toTitleCase = toTitleCase
}
