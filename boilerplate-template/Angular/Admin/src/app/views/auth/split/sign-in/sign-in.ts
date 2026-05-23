import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
