import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { toTitleCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-dropdowns',
  imports: [PageBreadcrumb, Icon, RouterLink, NgbDropdownModule],
  templateUrl: './dropdowns.html',
  styles: ``,
})
export class Dropdowns {
  dropdownVariants = [
    { name: 'primary', soft: false, variant: 'primary' },
    { name: 'secondary', soft: false, variant: 'light' },
    { name: 'success', soft: true, variant: 'success' },
    { name: 'info', soft: false, variant: 'info' },
    { name: 'warning', soft: false, variant: 'warning' },
    { name: 'danger', soft: false, variant: 'danger' },
  ]
  dropdownVariants1 = [
    { name: 'primary', variant: 'primary' },
    { name: 'secondary', variant: 'light' },
    { name: 'success', variant: 'success' },
    { name: 'info', variant: 'info' },
    { name: 'warning', variant: 'warning' },
    { name: 'danger', variant: 'danger' },
  ]
  protected readonly toTitleCase = toTitleCase
}
