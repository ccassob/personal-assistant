import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { Rating } from '@app/components/rating/rating'
import { CompanyType } from '../../data'

@Component({
  selector: 'app-company-card',
  imports: [Icon, RouterLink, Rating],
  templateUrl: './company-card.html',
  styles: ``,
})
export class CompanyCard {
  @Input() company!: CompanyType
}
