import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'app-invoice-detail',
  imports: [RouterLink, Icon],
  templateUrl: './invoice-detail.html',
  styles: ``,
})
export class InvoiceDetail {}
