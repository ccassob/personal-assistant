import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { tablerIconData } from './data'

@Component({
  selector: 'app-tabler',
  imports: [PageBreadcrumb],
  templateUrl: './tabler.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tabler {
  tablerIconData = tablerIconData
}
