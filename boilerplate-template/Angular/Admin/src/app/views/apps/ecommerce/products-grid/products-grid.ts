import { Component, inject, TemplateRef } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbOffcanvas, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { ProductCard } from './components/product-card/product-card'
import { ProductFilterSidebar } from './components/product-filter-sidebar/product-filter-sidebar'
import { productData } from './data'

@Component({
  selector: 'app-products-grid',
  imports: [PageBreadcrumb, RouterLink, Icon, ProductCard, SimplebarAngularModule, ProductFilterSidebar, NgbPaginationModule],
  templateUrl: './products-grid.html',
  styles: ``,
})
export class ProductsGrid {
  productData = productData
  private offcanvasService = inject(NgbOffcanvas)

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'start' })
  }
}
