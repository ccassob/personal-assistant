import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { provideServiceWorker } from '@angular/service-worker'
import { routes } from './app.routes'
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor'
import { authInterceptor } from './core/interceptors/auth.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
}
