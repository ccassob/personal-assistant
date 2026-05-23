import { PasswordStrengthBar } from '@/app/components/password-strength-bar/password-strength-bar'
import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, PasswordStrengthBar, FormsModule],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
  password: string = ''
}
