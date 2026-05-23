import { Component, Input } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { CountUpDirective } from 'ngx-countup'
import { OrderStatType } from '../../data'

@Component({
  selector: 'app-orders-widget',
  imports: [Icon, CountUpDirective],
  templateUrl: './orders-widget.html',
  styles: ``,
})
export class OrdersWidget {
  @Input() item!: OrderStatType
  Number = Number
}
