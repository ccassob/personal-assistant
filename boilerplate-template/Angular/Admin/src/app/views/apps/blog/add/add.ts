import { initQuillIcons } from '@/app/utils/quill-icons-init'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { FlatpickrDirective } from 'angularx-flatpickr'
import { QuillModule } from 'ngx-quill'

@Component({
  selector: 'app-add',
  imports: [PageBreadcrumb, QuillModule, FormsModule, FlatpickrDirective],
  templateUrl: './add.html',
  styles: ``,
})
export class Add {
  flatPickrOptions = {
    dateFormat: 'd M, Y H:i',
    enableTime: true,
    defaultDate: new Date(),
    monthSelectorType: 'dropdown' as const,
  }

  content: string = `
          <h3>Create, manage, and publish engaging blog articles effortlessly.</h3>
          <p><br /></p>
          <ul>
              <li>Write and format posts with an intuitive rich-text editor.</li>
              <li>Organize articles by categories, tags, and authors for easy navigation.</li>
              <li>Built-in SEO tools to help your content rank higher on search engines.</li>
              <li>Preview articles before publishing to ensure perfect layout and style.</li>
              <li>Fully responsive design ensures your blog looks great on any device.</li>
          </ul>
          <p><br /></p>
          <p>The Blog Article module helps you create professional-looking posts quickly. Ideal for personal blogs, news platforms, or content-driven websites.</p>
        `

  editorConfig = {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'super' }, { script: 'sub' }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { outdent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  constructor() {
    initQuillIcons()
  }
}
