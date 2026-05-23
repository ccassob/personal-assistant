import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { CategoryType } from '../../data'

@Component({
  selector: 'app-category-card',
  imports: [Icon, RouterLink],
  templateUrl: './category-card.html',
  styles: ``,
})
export class CategoryCard {
  @Input() category!: CategoryType
}
