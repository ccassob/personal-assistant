import { initQuillIcons } from '@/app/utils/quill-icons-init'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'app-text-editors',
  imports: [PageBreadcrumb, QuillEditorComponent, FormsModule],
  templateUrl: './text-editors.html',
  styles: ``,
})
export class TextEditors {
  content: string = `
   <h3>A powerful and responsive admin dashboard template built on Bootstrap.</h3>
                            <p><br></p>
  <ul>
      <li>
          Fully responsive layout with a sleek and modern design.
      </li>
      <li>
          Multiple pre-built pages such as login, registration, dashboard, charts, tables, and
          more.
      </li>
      <li>
          Includes various components like modals, alerts, navigation menus, etc.
      </li>
      <li>
          Easy to customize and extend to suit your project’s needs.
      </li>
      <li>
          Built with Bootstrap 5x, ensuring compatibility with a wide range of devices.
      </li>
  </ul>
  <p><br></p>
  <p>
      MyAdmin Admin is the perfect choice for your next admin project. Get started today and
      create a stunning interface for your application.
  </p>
`

  content1 = `
 <h3>A powerful and responsive admin dashboard template built on Bootstrap.</h3>
    <p><br></p>
    <ul>
        <li>
            Fully responsive layout with a sleek and modern design.
        </li>
        <li>
            Multiple pre-built pages such as login, registration, dashboard, charts, tables, and
            more.
        </li>
        <li>
            Includes various components like modals, alerts, navigation menus, etc.
        </li>
        <li>
            Easy to customize and extend to suit your project’s needs.
        </li>
        <li>
            Built with Bootstrap 5x, ensuring compatibility with a wide range of devices.
        </li>
    </ul>
    <p><br></p>
    <p>
        MyAdmin Admin is the perfect choice for your next admin project. Get started today and
        create a stunning interface for your application.
    </p>
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

  bubbleEditorConfig = {
    toolbar: [['bold', 'italic'], ['link'], [{ header: 1 }, { header: 2 }], ['blockquote']],
  }

  constructor() {
    initQuillIcons()
  }
}
