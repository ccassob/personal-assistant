import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { TitleCasePipe } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-buttons',
  imports: [Icon, TitleCasePipe, NgbDropdownModule, PageBreadcrumb, RouterLink],
  templateUrl: './buttons.html',
  styles: ``,
})
export class Buttons {
  colorVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'purple', 'light', 'dark']

  colorVariants2 = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'purple', 'dark']
}
