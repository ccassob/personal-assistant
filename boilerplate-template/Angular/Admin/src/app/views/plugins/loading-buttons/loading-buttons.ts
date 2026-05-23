import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { LaddaModule } from 'angular2-ladda'

@Component({
  selector: 'app-loading-buttons',
  imports: [PageBreadcrumb, LaddaModule, NgbAlertModule],
  templateUrl: './loading-buttons.html',
  styles: ``,
})
export class LoadingButtons {
  isLoading: { [key: string]: boolean } = {}
  showAlert = true

  buttonList = [
    { title: 'Expand Left', buttonStyle: 'expand-left', variant: 'primary' },
    { title: 'Expand Right', buttonStyle: 'expand-right', variant: 'primary' },
    { title: 'Expand Up', buttonStyle: 'expand-up', variant: 'primary' },
    { title: 'Expand Down', buttonStyle: 'expand-down', variant: 'primary' },
    { title: 'Contract', buttonStyle: 'contract', variant: 'warning' },
    { title: 'Zoom In', buttonStyle: 'zoom-in', variant: 'warning' },
    { title: 'Zoom Out', buttonStyle: 'zoom-out', variant: 'warning' },
    { title: 'Slide Left', buttonStyle: 'slide-left', variant: 'info' },
    { title: 'Slide Right', buttonStyle: 'slide-right', variant: 'info' },
    { title: 'Slide Up', buttonStyle: 'slide-up', variant: 'info' },
    { title: 'Slide Down', buttonStyle: 'slide-down', variant: 'info' },
    { title: 'Expand Right (Progress)', buttonStyle: 'expand-right', variant: 'danger' },
    { title: 'Contract (Progress)', buttonStyle: 'contract', variant: 'danger' },
    { title: 'Zoom In (API demo)', buttonStyle: 'zoom-in', variant: 'primary' },
  ]

  runLadda(style: string) {
    this.isLoading[style] = true
    setTimeout(() => {
      this.isLoading[style] = false
    }, 1500)
  }
}
