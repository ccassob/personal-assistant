import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

type PostType = {
  title: string
  href: string
}

type TagType = {
  name: string
  href: string
}

@Component({
  selector: 'app-article-sidebar',
  imports: [Icon, RouterLink],
  templateUrl: './article-sidebar.html',
  styles: ``,
})
export class ArticleSidebar {
  popularPostData: PostType[] = [
    { title: 'Unlocking the Secrets of Modern UI Design', href: '' },
    { title: 'How to Build a Portfolio with Tailwind CSS', href: '' },
    { title: 'Boost Productivity with These Web Dev Tools', href: '' },
    { title: 'The Future of Frontend: Trends to Watch in 2025', href: '' },
    { title: 'Essential Tips for Clean and Maintainable Code', href: '' },
  ]

  tagData: TagType[] = [
    { name: 'Web Design', href: '' },
    { name: 'Frontend', href: '' },
    { name: 'Tailwind CSS', href: '' },
    { name: 'JavaScript', href: '' },
    { name: 'React', href: '' },
    { name: 'Startup', href: '' },
    { name: 'DevTools', href: '' },
    { name: 'Open Source', href: '' },
    { name: 'Performance', href: '' },
    { name: 'UX/UI', href: '' },
    { name: 'SEO', href: '' },
  ]
}
