import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-notifications',
  imports: [PageBreadcrumb, NgbToastModule, FormsModule, Icon],
  templateUrl: './notifications.html',
  styles: ``,
})
export class Notifications {
  liveToast = false
  showToast = true
  showToast2 = true
  showToast3 = true
  placement = true
  toastPlacement: string = ''
  close() {
    this.showToast = false
  }
}
