import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NouisliderComponent } from 'ng2-nouislider'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-product-filter-sidebar',
  imports: [SimplebarAngularModule, Icon, NouisliderComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './product-filter-sidebar.html',
  styles: ``,
})
export class ProductFilterSidebar {
  productRange = [1000, 2500]
  stars = Array(5).fill(0)

  categoryData = [
    { id: 'cat-electronics', name: 'Electronics', count: 8 },
    { id: 'cat-computers', name: 'Computers', count: 5 },
    { id: 'cat-home-office', name: 'Home & Office', count: 6 },
    { id: 'cat-accessories', name: 'Accessories' },
    { id: 'cat-gaming', name: 'Gaming', count: 9 },
    { id: 'cat-mobile', name: 'Mobile Phones', count: 12 },
    { id: 'cat-appliances', name: 'Appliances' },
  ]

  brandData = [
    { id: 'brand-apple', name: 'Apple', count: 14 },
    { id: 'brand-samsung', name: 'Samsung', count: 20 },
    { id: 'brand-sony', name: 'Sony' },
    { id: 'brand-dell', name: 'Dell', count: 7 },
    { id: 'brand-hp', name: 'HP' },
  ]

  ratingData = [
    { id: '5-star', stars: 5, label: '5 Stars & Up', count: 120 },
    { id: '4-star', stars: 4, label: '4 Stars & Up', count: 210 },
    { id: '3-star', stars: 3, label: '3 Stars & Up', count: 325 },
    { id: '2-star', stars: 2, label: '2 Stars & Up', count: 145 },
    { id: '1-star', stars: 1, label: '1 Star & Up', count: 58 },
  ]
}
