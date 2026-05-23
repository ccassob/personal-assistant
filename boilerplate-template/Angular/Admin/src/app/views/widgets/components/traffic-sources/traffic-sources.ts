import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { CountUpDirective } from 'ngx-countup'
import { trafficData } from '../../data'

@Component({
  selector: 'app-traffic-sources',
  imports: [CountUpDirective, NgbProgressbarModule, CardWithAction],
  templateUrl: './traffic-sources.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrafficSources {
  trafficData = trafficData
}
