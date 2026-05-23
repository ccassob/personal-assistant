import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-carousel',
  imports: [PageBreadcrumb, NgbCarouselModule, Icon],
  templateUrl: './carousel.html',
  styles: ``,
})
export class Carousel {
  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true
    config.showNavigationIndicators = true
  }
}
