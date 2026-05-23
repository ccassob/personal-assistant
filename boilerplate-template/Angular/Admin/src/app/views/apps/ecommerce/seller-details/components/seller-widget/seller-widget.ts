import { Component, Input } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { CountUpDirective } from 'ngx-countup'
import { SellerStatType } from '../../data'

@Component({
  selector: 'app-seller-widget',
  imports: [Icon, CountUpDirective],
  templateUrl: './seller-widget.html',
  styles: ``,
})
export class SellerWidget {
  @Input() item!: SellerStatType
  Number = Number
}
