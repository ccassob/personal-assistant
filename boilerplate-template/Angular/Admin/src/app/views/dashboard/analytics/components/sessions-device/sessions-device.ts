import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { deviceSessionData, deviceSessionsChartOptions } from '../../data'

@Component({
  selector: 'app-sessions-device',
  imports: [Apexchart, CardWithAction],
  templateUrl: './sessions-device.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SessionsDevice {
  deviceSessionsChartOptions = deviceSessionsChartOptions
  deviceSessionData = deviceSessionData
}
