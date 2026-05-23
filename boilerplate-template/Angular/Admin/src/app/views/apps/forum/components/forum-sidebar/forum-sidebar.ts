import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'

@Component({
  selector: 'app-forum-sidebar',
  imports: [Icon, RouterLink],
  templateUrl: './forum-sidebar.html',
  styles: ``,
})
export class ForumSidebar {
  categoryData: string[] = ['Development Talk', 'AI & Ethics', 'Product Design', 'Career Growth', 'Open Source']

  questionData: string[] = ['Unlocking the Secrets of Modern UI Design', 'How to Build a Portfolio with Tailwind CSS', 'Boost Productivity with These Web Dev Tools', 'The Future of Frontend: Trends to Watch in 2025', 'Essential Tips for Clean and Maintainable Code']

  tagData: string[] = ['Web Design', 'Frontend', 'Tailwind CSS', 'JavaScript', 'React', 'Startup', 'DevTools', 'Open Source', 'Performance', 'UX/UI', 'SEO']
}
