import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap'
import { ProductReviews } from './components/product-reviews/product-reviews'
const product1 = 'assets/images/products/single-1.png'
const product2 = 'assets/images/products/single-2.png'
const product3 = 'assets/images/products/single-3.png'
const product4 = 'assets/images/products/single-4.png'

@Component({
  selector: 'app-product-details',
  imports: [PageBreadcrumb, ProductReviews, NgbCarouselModule, Icon, RouterLink],
  templateUrl: './product-details.html',
  styles: ``,
})
export class ProductDetails implements AfterViewInit {
  @ViewChild('carousel') carousel!: NgbCarousel
  products = [{ image: product1 }, { image: product2 }, { image: product3 }, { image: product4 }]
  activeSlide = 'slide-0'

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.activeSlide = this.carousel.activeId
    this.cdr.detectChanges()
  }

  changeSlide(id: string) {
    this.activeSlide = id
    this.carousel.select(id)
  }

  onSlide(event: NgbSlideEvent) {
    this.activeSlide = event.current
  }
}
