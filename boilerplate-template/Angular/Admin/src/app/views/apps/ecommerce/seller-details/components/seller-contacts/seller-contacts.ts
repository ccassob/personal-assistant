import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-seller-contacts',
  imports: [RouterLink, Icon, NgbDropdownModule],
  templateUrl: './seller-contacts.html',
  styles: ``,
})
export class SellerContacts {}
