import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { GlightboxInitDirective } from '@core/directive/glightbox.directive'
import { NgxMasonryComponent, NgxMasonryModule } from 'ngx-masonry'
const img1 = 'assets/images/gallery/1.jpg'
const img10 = 'assets/images/gallery/10.jpg'
const img11 = 'assets/images/gallery/11.jpg'
const img12 = 'assets/images/gallery/12.jpg'
const img13 = 'assets/images/gallery/13.jpg'
const img14 = 'assets/images/gallery/14.jpg'
const img2 = 'assets/images/gallery/2.jpg'
const img3 = 'assets/images/gallery/3.jpg'
const img4 = 'assets/images/gallery/4.jpg'
const img5 = 'assets/images/gallery/5.jpg'
const img6 = 'assets/images/gallery/6.jpg'
const img7 = 'assets/images/gallery/7.jpg'
const img8 = 'assets/images/gallery/8.jpg'
const img9 = 'assets/images/gallery/9.jpg'

type GalleryItem = {
  category: string
  image: string
  label: string
  className: string
}

@Component({
  selector: 'app-gallery',
  imports: [PageBreadcrumb, Icon, NgxMasonryModule, GlightboxInitDirective],
  templateUrl: './gallery.html',
  styles: ``,
})
export class Gallery implements OnInit, AfterViewInit {
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent

  categoryFilter: string = ''

  images: GalleryItem[] = [
    {
      category: 'beautiful',
      image: img1,
      label: 'beautiful',
      className: 'text-bg-dark',
    },
    { category: 'nature', image: img2, label: 'Health', className: 'text-bg-danger' },
    {
      category: 'beautiful',
      image: img3,
      label: 'Travel',
      className: 'text-bg-primary',
    },
    { category: 'nature', image: img6, label: 'Sports', className: 'text-bg-warning' },
    {
      category: 'nature',
      image: img4,
      label: 'Business',
      className: 'text-bg-info',
    },
    { category: 'travel', image: img5, label: 'Education', className: 'text-bg-success' },
    { category: 'city', image: img7, label: 'Fashion', className: 'text-bg-secondary' },
    { category: 'travel', image: img9, label: 'Food', className: 'text-bg-success' },
    {
      category: 'beautiful',
      image: img10,
      label: 'Entertainment',
      className: 'text-bg-danger',
    },
    {
      category: 'nature',
      image: img11,
      label: 'Sports',
      className: 'text-bg-warning',
    },
    { category: 'city', image: img12, label: 'Fashion', className: 'text-bg-secondary' },
    { category: 'city', image: img13, label: 'Lifestyle', className: 'text-bg-light' },
    { category: 'city', image: img8, label: 'Lifestyle', className: 'text-bg-light' },
    { category: 'travel', image: img14, label: 'Food', className: 'text-bg-success' },
  ]

  galleryItems = this.images

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.masonry?.reloadItems()
      this.masonry?.layout()
    }, 0)
  }

  ngOnInit(): void {
    this.filterCategory('')
  }

  filterCategory(category: string): void {
    this.categoryFilter = category
    this.galleryItems = category ? this.images.filter((img) => img.category === category) : this.images
  }
}
