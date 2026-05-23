import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

const blog1 = 'assets/images/blog/blog-1.jpg'
const blog2 = 'assets/images/blog/blog-2.jpg'
const blog3 = 'assets/images/blog/blog-3.jpg'
const blog4 = 'assets/images/blog/blog-4.jpg'
const blog5 = 'assets/images/blog/blog-5.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'

type BlogType = {
  category: { label: string; className: string }
  image: string
  title: string
  description: string
  tags: string[]
  date: string
  comments: number
  views: number
  author: {
    name: string
    image: string
  }
}

@Component({
  selector: 'app-list-card',
  imports: [Icon, RouterLink, NgbPaginationModule],
  templateUrl: './list-card.html',
  styles: ``,
})
export class ListCard {
  page = 1

  blogData: BlogType[] = [
    {
      category: { label: 'Development', className: 'text-bg-dark' },
      image: blog1,
      title: 'Building REST APIs with Node.js',
      description: 'Learn how to design and build scalable REST APIs with Node.js and Express in this step-by-step tutorial.',
      tags: ['Node.js', 'API', 'Tutorial'],
      date: 'Feb 2, 2025',
      comments: 16,
      views: 8974,
      author: { name: 'John Doe', image: user3 },
    },
    {
      category: { label: 'Design', className: 'text-bg-primary' },
      image: blog2,
      title: '10 Essential UI Design Tips for Better User Experience',
      description: 'Discover key principles and practical tips to enhance usability, accessibility, and aesthetics in your web design.',
      tags: ['Design', 'UI/UX', 'Tips'],
      date: 'Mar 10, 2025',
      comments: 24,
      views: 12346,
      author: { name: 'Sarah Lee', image: user5 },
    },
    {
      category: { label: 'Technology', className: 'text-bg-success' },
      image: blog3,
      title: 'How AI is Transforming Modern Web Development',
      description: 'Explore how artificial intelligence is revolutionizing the way developers build, test, and deploy web applications.',
      tags: ['AI', 'Web', 'Technology'],
      date: 'Apr 5, 2025',
      comments: 32,
      views: 15478,
      author: { name: 'Michael Brown', image: user7 },
    },
    {
      category: { label: 'Marketing', className: 'text-bg-warning' },
      image: blog4,
      title: 'Top 5 Content Marketing Strategies That Work in 2025',
      description: 'Learn how to build a strong content plan, leverage social media trends, and boost engagement with your target audience.',
      tags: ['Marketing', 'SEO', 'Strategy'],
      date: 'May 18, 2025',
      comments: 19,
      views: 9812,
      author: { name: 'Emily Carter', image: user8 },
    },
    {
      category: { label: 'Startup', className: 'text-bg-info' },
      image: blog5,
      title: 'Scaling Your Startup: Lessons from Successful Founders',
      description: 'Explore actionable insights from entrepreneurs on managing growth, funding rounds, and building strong company culture.',
      tags: ['Startup', 'Growth', 'Business'],
      date: 'Jun 9, 2025',
      comments: 27,
      views: 14532,
      author: { name: 'David Wilson', image: user9 },
    },
  ]

  protected readonly toPascalCase = toPascalCase
}
