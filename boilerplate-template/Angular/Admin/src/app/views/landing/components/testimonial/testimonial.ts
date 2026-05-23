import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Rating } from '@app/components/rating/rating'
import { clientData, testimonialData } from '../../data'

@Component({
  selector: 'app-testimonial',
  imports: [RouterLink, Rating],
  templateUrl: './testimonial.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Testimonial {
  testimonialData = testimonialData
  clientData = clientData
}
