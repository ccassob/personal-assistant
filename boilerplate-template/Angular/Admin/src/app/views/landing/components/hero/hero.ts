import { META_DATA } from '@/app/constants'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { userData } from '../../data'

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Hero {
  userData = userData
  buyUrl = META_DATA.buyUrl
  supportUrl = META_DATA.supportUrl
}
