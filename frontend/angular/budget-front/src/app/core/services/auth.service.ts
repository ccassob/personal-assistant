import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { tap } from 'rxjs/operators'
import { API_BASE } from '../../constants'

interface JwtPayload {
  sub: string
  email: string
  name: string
  exp: number
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'budget_token'

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${API_BASE}/api/auth/login`, { email, password })
      .pipe(tap(r => localStorage.setItem(this.TOKEN_KEY, r.token)))
  }

  register(email: string, password: string, displayName: string) {
    return this.http.post<{ token: string }>(`${API_BASE}/api/auth/register`, { email, password, displayName })
      .pipe(tap(r => localStorage.setItem(this.TOKEN_KEY, r.token)))
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY)
    this.router.navigate(['/login'])
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  get isLoggedIn(): boolean {
    const t = this.token
    if (!t) return false
    return !this.isTokenExpired(t)
  }

  get userEmail(): string {
    return this.decodePayload()?.email ?? ''
  }

  get userName(): string {
    return this.decodePayload()?.name ?? ''
  }

  private decodePayload(): JwtPayload | null {
    const t = this.token
    if (!t) return null
    try {
      const payload = t.split('.')[1]
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return null
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
