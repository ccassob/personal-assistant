import { DecimalPipe } from '@angular/common'
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    DecimalPipe,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideDaterangepickerLocale({
      separator: ' - ',
      cancelLabel: 'Cancel',
    }),
  ],
}
