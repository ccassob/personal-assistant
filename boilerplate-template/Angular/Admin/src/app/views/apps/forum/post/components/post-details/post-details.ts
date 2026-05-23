import { currentYear } from '@/app/constants'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
const user8 = 'assets/images/users/user-8.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user6 = 'assets/images/users/user-6.jpg'

type CommentType = {
  user: {
    name: string
    image: string
  }
  date: string
  time: string
  message: string
  reply?: CommentType[]
}

@Component({
  selector: 'app-post-details',
  imports: [Icon, RouterLink, NgbPaginationModule],
  templateUrl: './post-details.html',
  styles: ``,
})
export class PostDetails {
  currentYear = currentYear
  page = 2
  commentData: CommentType[] = [
    {
      user: {
        name: 'Liam Carter',
        image: user8,
      },
      date: '15 Apr 2025',
      time: '09:20AM',
      message: 'Customers are reporting that the checkout page freezes after submitting their payment information.',
      reply: [
        {
          user: {
            name: 'Nina Bryant',
            image: user10,
          },
          date: '15 Apr 2025',
          time: '11:47AM',
          message: 'That might be caused by the third-party payment gateway. I recommend testing in incognito mode and checking for any JS errors in the console.',
        },
        {
          user: {
            name: 'Sophie Allen',
            image: user3,
          },
          date: '16 Apr 2025',
          time: '10:15AM',
          message: "We’ve noticed this issue before when the CDN cache hasn't been cleared properly. Try purging the cache and reloading the page.",
        },
      ],
    },
    {
      user: {
        name: 'Daniel West',
        image: user6,
      },
      date: '14 Apr 2025',
      time: '04:15PM',
      message: 'You can also clear the browser cache or try a different browser. We had a similar issue with Chrome extensions interfering before.',
    },
    {
      user: {
        name: 'Nina Bryant',
        image: user10,
      },
      date: '16 Apr 2025',
      time: '08:04AM',
      message: "The System Status Page has been updated. We're actively monitoring and will release a patch within 24 hours.",
      reply: [
        {
          user: {
            name: 'Daniel West',
            image: user6,
          },
          date: '16 Apr 2025',
          time: '08:30AM',
          message: "Thanks for the update! We'll notify the customers and let them know the issue is being resolved.",
        },
      ],
    },
  ]
}
