import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { topCountryData } from '../../data'

@Component({
  selector: 'app-top-countries',
  imports: [CardWithAction, RouterLink],
  templateUrl: './top-countries.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TopCountries {
  topCountryData = topCountryData
}
