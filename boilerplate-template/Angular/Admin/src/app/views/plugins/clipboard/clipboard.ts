import { Component, inject } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ClipboardService } from './clipboard.service'

@Component({
  selector: 'app-clipboard',
  imports: [PageBreadcrumb, Icon],
  templateUrl: './clipboard.html',
  styles: ``,
})
export class Clipboard {
  private clipboard = inject(ClipboardService)

  copyFromElement(el: HTMLElement) {
    const value = (el as HTMLInputElement).value || el.innerText
    this.clipboard.highlightElementText(el)
    this.clipboard.copyText(value)
  }

  cutFromInput(el: HTMLInputElement | HTMLTextAreaElement) {
    this.clipboard.cutText(el)
  }
}
