import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { ContactCard } from './components/contact-card/contact-card'
import { contactData } from './data'

@Component({
  selector: 'app-contacts',
  imports: [PageBreadcrumb, ContactCard, NgbPaginationModule, Icon],
  templateUrl: './contacts.html',
  styles: ``,
})
export class Contacts {
  contactData = contactData
}
