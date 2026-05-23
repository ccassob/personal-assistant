import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { basicActivityData } from '../../data'

@Component({
  selector: 'app-basic-activity',
  imports: [RouterLink],
  templateUrl: './basic-activity.html',
  styles: ``,
})
export class BasicActivity {
  basicActivityData = basicActivityData
}
