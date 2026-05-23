import { Icon } from '@/app/components/icon/icon'
import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-reset-pass',
  imports: [Icon, RouterLink],
  templateUrl: './reset-pass.html',
  styles: ``,
})
export class ResetPass {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
