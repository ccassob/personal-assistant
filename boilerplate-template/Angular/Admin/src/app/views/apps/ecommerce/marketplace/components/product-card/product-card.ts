import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { Rating } from '@app/components/rating/rating'
import { ProductType } from '../../data'

@Component({
  selector: 'app-product-card',
  imports: [Icon, RouterLink, Rating],
  templateUrl: './product-card.html',
  styles: ``,
})
export class ProductCard {
  @Input() product!: ProductType
}
