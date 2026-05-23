import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { serviceData } from '../../data'

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Services {
  serviceData = serviceData
}
