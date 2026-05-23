import { Component, Input } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { RefundStatType } from '../../data'

@Component({
  selector: 'app-refunds-widget',
  imports: [Icon],
  templateUrl: './refunds-widget.html',
  styles: ``,
})
export class RefundsWidget {
  @Input() item!: RefundStatType
}
