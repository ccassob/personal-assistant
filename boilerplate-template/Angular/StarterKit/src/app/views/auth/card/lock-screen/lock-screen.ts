import { Icon } from '@/app/components/icon/icon'
import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-lock-screen',
  imports: [Icon, RouterLink],
  templateUrl: './lock-screen.html',
  styles: ``,
})
export class LockScreen {
  currentYear = currentYear
  username = META_DATA.username
  name = META_DATA.name
  author = META_DATA.author
}
