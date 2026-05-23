import { Component, ViewChild } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgxMasonryComponent, NgxMasonryModule } from 'ngx-masonry'
import { BlogCard } from './components/blog-card/blog-card'
import { blogData } from './data'

@Component({
  selector: 'app-grid',
  imports: [PageBreadcrumb, BlogCard, NgxMasonryModule],
  templateUrl: './grid.html',
  styles: ``,
})
export class Grid {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.masonry?.reloadItems()
      this.masonry?.layout()
    }, 0)
  }

  blogData = blogData
}
