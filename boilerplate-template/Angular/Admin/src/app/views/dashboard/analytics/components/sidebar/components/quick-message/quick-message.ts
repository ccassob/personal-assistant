import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { quickMessageData } from '../../../../data'

@Component({
  selector: 'app-quick-message',
  imports: [RouterLink],
  templateUrl: './quick-message.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuickMessage {
  quickMessageData = quickMessageData
}
