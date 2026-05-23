import { Component } from '@angular/core'
import { About } from './components/about/about'
import { BlogPost } from './components/blog-post/blog-post'
import { PersonalInformation } from './components/personal-information/personal-information'
import { Skills } from './components/skills/skills'
import { SocialFeed } from './components/social-feed/social-feed'
import { StatisticsCard } from './components/statistics-card/statistics-card'
import { Tasks } from './components/tasks/tasks'
import { UserCard } from './components/user-card/user-card'
import { blogData, statisticsData } from './data'

@Component({
  selector: 'app-profile',
  imports: [UserCard, PersonalInformation, Skills, SocialFeed, About, Tasks, BlogPost, StatisticsCard],
  templateUrl: './profile.html',
  styles: ``,
})
export class Profile {
  statisticsData = statisticsData
  blogData = blogData
}
