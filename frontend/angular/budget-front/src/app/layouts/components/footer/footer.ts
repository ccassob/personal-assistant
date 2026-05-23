import { Component } from '@angular/core'
import { APP_NAME, currentYear } from '../../../constants'

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="footer mt-auto">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            &copy; {{ currentYear }} {{ appName }}
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = currentYear
  appName = APP_NAME
}
