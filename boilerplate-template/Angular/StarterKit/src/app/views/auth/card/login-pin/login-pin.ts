import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOtpInputComponent } from 'ng-otp-input'

@Component({
  selector: 'app-login-pin',
  imports: [NgOtpInputComponent, RouterLink],
  templateUrl: './login-pin.html',
  styles: ``,
})
export class LoginPin {
  currentYear = currentYear
  username = META_DATA.username
  name = META_DATA.name
  author = META_DATA.author
}
