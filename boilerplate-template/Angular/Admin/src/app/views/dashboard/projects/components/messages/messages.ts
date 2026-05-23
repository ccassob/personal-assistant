import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { messageData } from '../../data'

@Component({
  selector: 'app-messages',
  imports: [RouterLink],
  templateUrl: './messages.html',
  styles: ``,
})
export class Messages {
  messageData = messageData
}
