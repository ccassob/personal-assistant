import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dummyUser = {
    email: 'admin@example.com',
    password: 'password',
    token: 'auth-token',
  }

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === this.dummyUser.email && password === this.dummyUser.password) {
      sessionStorage.setItem('token', this.dummyUser.token)
      return true
    }
    return false
  }

  logout() {
    sessionStorage.removeItem('token')
    this.router.navigate(['/auth/sign-in'])
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token')
  }
}
