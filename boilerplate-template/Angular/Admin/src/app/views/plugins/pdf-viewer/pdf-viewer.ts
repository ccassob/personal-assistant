import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer'

@Component({
  selector: 'app-pdf-viewer',
  imports: [PageBreadcrumb, PdfViewerModule, FormsModule, Icon],
  templateUrl: './pdf-viewer.html',
  styles: ``,
})
export class PdfViewer {
  pdfSrc = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
  currentPage = 1
  totalPages = 0
  zoom = 1

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }

  zoomIn(): void {
    this.zoom += 0.1
  }

  zoomOut(): void {
    this.zoom = Math.max(0.1, this.zoom - 0.1)
  }

  zoomFit(): void {
    this.zoom = 1.0
  }
}
