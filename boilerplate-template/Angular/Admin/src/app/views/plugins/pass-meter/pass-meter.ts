import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { PasswordStrengthBar } from '@app/components/password-strength-bar/password-strength-bar'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-pass-meter',
  imports: [PageBreadcrumb, PasswordStrengthBar, FormsModule, NgbCollapseModule],
  templateUrl: './pass-meter.html',
  styles: ``,
})
export class PassMeter {
  password: string = ''

  magicPassword = ''
  showRules = false

  get isLengthValid() {
    return this.magicPassword.length >= 8
  }
  get hasLowercase() {
    return /[a-z]/.test(this.magicPassword)
  }
  get hasUppercase() {
    return /[A-Z]/.test(this.magicPassword)
  }
  get hasNumber() {
    return /[0-9]/.test(this.magicPassword)
  }

  onBlur() {
    if (this.magicPassword.length > 0) {
      this.showRules = true
    } else {
      this.showRules = false
    }
  }
}
