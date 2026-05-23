import { currentYear } from '@/app/constants'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { footerData, socialData } from '../../data'

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Footer {
  currentYear = currentYear
  socialData = socialData
  footerData = footerData
}
