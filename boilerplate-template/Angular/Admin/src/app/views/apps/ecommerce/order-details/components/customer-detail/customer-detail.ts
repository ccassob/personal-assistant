import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-customer-detail',
  imports: [RouterLink, Icon, NgbDropdownModule],
  templateUrl: './customer-detail.html',
  styles: ``,
})
export class CustomerDetail {}
