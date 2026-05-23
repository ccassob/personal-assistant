import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { blogData } from '../../data'

@Component({
  selector: 'app-blogs',
  imports: [RouterLink],
  templateUrl: './blogs.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Blogs {
  blogData = blogData
}
