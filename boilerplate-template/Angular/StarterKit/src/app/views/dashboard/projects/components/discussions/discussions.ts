import { generateInitials } from '@/app/utils/string'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { userMessageData } from '../../data'

@Component({
  selector: 'app-discussions',
  imports: [RouterLink],
  templateUrl: './discussions.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Discussions {
  userMessageData = userMessageData
  protected readonly generateInitials = generateInitials
}
