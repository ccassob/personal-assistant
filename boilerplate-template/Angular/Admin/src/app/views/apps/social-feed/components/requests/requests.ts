import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { requestData } from '../../data'

@Component({
  selector: 'app-requests',
  imports: [NgbDropdownModule, Icon, RouterLink],
  templateUrl: './requests.html',
  styles: ``,
})
export class Requests {
  requestData = requestData
}
