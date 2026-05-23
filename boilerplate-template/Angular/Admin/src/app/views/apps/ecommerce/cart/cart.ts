import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { CounterDirective } from '@core/directive/counter.directive'
const product1 = 'assets/images/products/1.png'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'

export type CartItemType = {
  image: string
  name: string
  color: string
  model: string
  price: string
  discount?: string
  quantity: number
}

@Component({
  selector: 'app-cart',
  imports: [PageBreadcrumb, RouterLink, Icon, CounterDirective],
  templateUrl: './cart.html',
  styles: ``,
})
export class Cart {
  cartItemData: CartItemType[] = [
    {
      image: product1,
      name: 'Apple iPhone 14 128GB',
      color: 'White',
      model: '128GB',
      price: '$899.00',
      quantity: 1,
    },
    {
      image: product2,
      name: 'Tablet Apple iPad Pro M2',
      color: 'Black',
      model: '256GB',
      price: '$989.00',
      discount: '$1099.00',
      quantity: 3,
    },
    {
      image: product3,
      name: 'Smart Watch Series 7',
      color: 'White',
      model: '44mm',
      price: '$429.00',
      quantity: 2,
    },
  ]
  removeItem(index: number) {
    this.cartItemData.splice(index, 1)
  }
}
