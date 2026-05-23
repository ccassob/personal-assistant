import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { splitArray, toTitleCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-elements',
  imports: [PageBreadcrumb, NgbDropdownModule, Icon, RouterLink],
  templateUrl: './elements.html',
  styles: ``,
})
export class Elements {
  showPassword: boolean = true

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  colorVariants = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'purple', 'dark']

  get checkboxColumns() {
    return splitArray(this.colorVariants, Math.ceil(this.colorVariants.length / 2))
  }

  protected readonly toTitleCase = toTitleCase
}
