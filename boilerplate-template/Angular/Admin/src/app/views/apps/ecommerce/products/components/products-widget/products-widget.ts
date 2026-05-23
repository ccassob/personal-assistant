import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { CountUpDirective } from 'ngx-countup'
import { StatType } from '../../data'

@Component({
  selector: 'app-products-widget',
  imports: [RouterLink, Icon, CountUpDirective],
  templateUrl: './products-widget.html',
  styles: ``,
})
export class ProductsWidget {
  @Input() stats!: StatType
  Number = Number
}
