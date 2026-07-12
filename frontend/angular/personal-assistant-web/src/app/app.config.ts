import { DecimalPipe } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideServiceWorker } from '@angular/service-worker'
import { apiUrlInterceptor } from '@core/interceptors/api-url.interceptor'
import { authInterceptor } from '@core/interceptors/auth.interceptor'
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    DecimalPipe,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideDaterangepickerLocale({ separator: ' - ', cancelLabel: 'Cancel' }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
}
