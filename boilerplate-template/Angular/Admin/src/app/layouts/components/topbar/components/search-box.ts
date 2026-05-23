import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'search-box',
  imports: [Icon],
  template: `
    <div id="search-box" class="app-search d-none d-xl-flex">
      <input type="search" class="form-control topbar-search" name="search" placeholder="Search for something..." />
      <app-icon icon="search" class="app-search-icon text-muted"></app-icon>
    </div>
  `,
  styles: ``,
})
export class SearchBox {}
