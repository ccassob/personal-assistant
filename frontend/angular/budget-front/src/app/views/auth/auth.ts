import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="text-center mb-4">
          <iconify-icon icon="tabler:wallet" width="40" class="text-primary"></iconify-icon>
          <h4 class="mt-2 mb-0">Budget App</h4>
        </div>

        <div class="d-flex mb-4 border-bottom">
          <button class="flex-fill btn btn-link text-decoration-none pb-2 fw-semibold"
            [class.border-bottom]="mode === 'login'"
            [class.border-primary]="mode === 'login'"
            [class.border-2]="mode === 'login'"
            (click)="mode = 'login'; error = ''">
            Login
          </button>
          <button class="flex-fill btn btn-link text-decoration-none pb-2 fw-semibold"
            [class.border-bottom]="mode === 'register'"
            [class.border-primary]="mode === 'register'"
            [class.border-2]="mode === 'register'"
            (click)="mode = 'register'; error = ''">
            Register
          </button>
        </div>

        @if (error) {
          <div class="alert alert-danger py-2">{{ error }}</div>
        }

        @if (mode === 'login') {
          <form (ngSubmit)="login()">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [(ngModel)]="email" name="email" required autocomplete="email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" [(ngModel)]="password" name="password" required autocomplete="current-password" />
            </div>
            <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
              @if (loading) { Signing in... } @else { Sign in }
            </button>
          </form>
        }

        @if (mode === 'register') {
          <form (ngSubmit)="register()">
            <div class="mb-3">
              <label class="form-label">Display Name</label>
              <input type="text" class="form-control" [(ngModel)]="displayName" name="displayName" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [(ngModel)]="email" name="email" required autocomplete="email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Password <small class="text-muted">(min 8 chars, 1 digit)</small></label>
              <input type="password" class="form-control" [(ngModel)]="password" name="password" required autocomplete="new-password" />
            </div>
            <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
              @if (loading) { Creating account... } @else { Create account }
            </button>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bs-body-bg);
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: var(--bs-card-bg, var(--bs-body-bg));
      border: 1px solid var(--bs-border-color);
      border-radius: 0.5rem;
      box-shadow: 0 4px 24px rgba(0,0,0,.08);
    }
  `],
})
export class Auth {
  mode: 'login' | 'register' = 'login'
  email = ''
  password = ''
  displayName = ''
  error = ''
  loading = false

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true
    this.error = ''
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        this.error = e?.error?.message ?? 'Invalid email or password.'
        this.loading = false
      },
    })
  }

  register() {
    this.loading = true
    this.error = ''
    this.auth.register(this.email, this.password, this.displayName).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        this.error = e?.error?.message ?? 'Registration failed. Check your details and try again.'
        this.loading = false
      },
    })
  }
}
