import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styles: ``,
})
export class SignIn {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author

  email = 'admin@example.com'
  password = 'password'
  error = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const isLoggedIn = this.auth.login(this.email, this.password)

    if (isLoggedIn) {
      this.router.navigate([''])
    } else {
      this.error = 'Invalid email or password'
    }
  }
}
