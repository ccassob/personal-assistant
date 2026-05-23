import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { CategoryCard } from './components/category-card/category-card'
import { ProductCard } from './components/product-card/product-card'
import { categoryData, productData } from './data'

const client1 = 'assets/images/clients/01.svg'
const client2 = 'assets/images/clients/02.svg'
const client3 = 'assets/images/clients/03.svg'
const client4 = 'assets/images/clients/04.svg'
const client5 = 'assets/images/clients/05.svg'
const client6 = 'assets/images/clients/06.svg'
const client7 = 'assets/images/clients/07.svg'

@Component({
  selector: 'app-marketplace',
  imports: [PageBreadcrumb, CategoryCard, RouterLink, ProductCard, Icon],
  templateUrl: './marketplace.html',
  styles: ``,
})
export class Marketplace {
  categoryData = categoryData
  productData = productData

  brands = [{ image: client1 }, { image: client2 }, { image: client3 }, { image: client4 }, { image: client5 }, { image: client6 }, { image: client7 }]
}
