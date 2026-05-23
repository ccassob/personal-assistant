import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgxMasonryComponent, NgxMasonryModule } from 'ngx-masonry'
import { blogData } from './data'

@Component({
  selector: 'app-masonry',
  imports: [PageBreadcrumb, RouterLink, Icon, NgxMasonryModule],
  templateUrl: './masonry.html',
  styles: ``,
})
export class Masonry implements AfterViewInit {
  blogData = blogData

  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.masonry?.reloadItems()
      this.masonry?.layout()
    }, 0)
  }
}
