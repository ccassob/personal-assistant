import { currentYear, META_DATA } from '@/app/constants'
import { Component } from '@angular/core'

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="footer mt-auto">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 text-center text-md-start">
            ©
            {{ currentYear }}
            {{ name }} By
            <span class="fw-semibold">{{ author }}</span>
          </div>
          <div class="col-md-6">
            <div class="text-md-end d-none d-md-block">
              10GB of
              <span class="fw-bold">250GB</span>
              Free.
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  currentYear = currentYear
  name = META_DATA.name
  author = META_DATA.author
}
