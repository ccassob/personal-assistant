import { initQuillIcons } from '@/app/utils/quill-icons-init'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { FileUploader } from '@app/components/file-uploader/file-uploader'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'app-product-add',
  imports: [PageBreadcrumb, RouterLink, Icon, QuillEditorComponent, FormsModule, FileUploader],
  templateUrl: './product-add.html',
  styles: ``,
})
export class ProductAdd {
  editorContent: string = `
   <p>Introducing the <strong><em>Azure Comfort Single
                                  Sofa</em></strong>, a perfect blend of modern design and
                                  luxurious comfort.</p>

                              <p>This premium blue single sofa is designed to elevate any living
                                  space with its sleek profile and rich, durable fabric. It’s the
                                  perfect seating option for your living room, lounge area, or
                                  cozy reading nook.</p>

                              <ul>
                                  <li>Crafted with a solid mahogany frame for enhanced
                                      durability.
                                  </li>
                                  <li>Upholstered in a high-quality blue fabric that offers both
                                      style and comfort.
                                  </li>
                              </ul>`

  editorConfig = {
    toolbar: [['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { list: 'bullet' }, 'link', 'image']],
  }

  constructor() {
    initQuillIcons()
  }
}
