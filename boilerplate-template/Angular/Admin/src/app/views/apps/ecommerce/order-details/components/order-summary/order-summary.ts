import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'app-order-summary',
  imports: [RouterLink, Icon],
  templateUrl: './order-summary.html',
  styles: ``,
})
export class OrderSummary {}
