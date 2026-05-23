const inFlag = 'assets/images/flags/in.svg'
const deFlag = 'assets/images/flags/de.svg'
const frFlag = 'assets/images/flags/fr.svg'
const usFlag = 'assets/images/flags/us.svg'
const gbFlag = 'assets/images/flags/gb.svg'
const caFlag = 'assets/images/flags/ca.svg'
const jpFlag = 'assets/images/flags/jp.svg'
const auFlag = 'assets/images/flags/au.svg'
const brFlag = 'assets/images/flags/br.svg'
const itFlag = 'assets/images/flags/it.svg'

const user8 = 'assets/images/users/user-8.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user5 = 'assets/images/users/user-5.jpg'

export type StatisticCard1Type = {
  title: string
  count: {
    value: number
    prefix?: string
    suffix?: string
  }
  subtitle: string
  totalCount: {
    value: number
    prefix?: string
    suffix?: string
  }
  icon: string
  variant: string
}

export const statisticCard1Data: StatisticCard1Type[] = [
  {
    title: 'Orders',
    count: { value: 1250 },
    subtitle: 'Total Orders',
    totalCount: { value: 15320 },
    icon: 'tabler:shopping-cart',
    variant: 'success',
  },
  {
    title: 'Revenue',
    count: { value: 98.7, prefix: '$', suffix: 'k' },
    subtitle: 'Total Revenue',
    totalCount: { value: 1.2, prefix: '$', suffix: 'M' },
    icon: 'tabler:currency-dollar',
    variant: 'warning',
  },
  {
    title: 'Ratings',
    count: { value: 4.8 },
    subtitle: 'Average Rating',
    totalCount: { value: 5, suffix: 'k Reviews' },
    icon: 'tabler:star',
    variant: 'info',
  },
  {
    title: 'Products',
    count: { value: 350 },
    subtitle: 'Total Products',
    totalCount: { value: 750, suffix: ' Variants' },
    icon: 'tabler:box',
    variant: 'secondary',
  },
]

export type SalesOverviewType = {
  title: string
  variant?: string
  value: string
  prefix?: string
  suffix?: string
  change: number
  progress: number
}

export const salesOverviewData: SalesOverviewType[] = [
  {
    title: 'Total sales in period',
    variant: 'primary',
    value: '24,500',
    prefix: '$',
    change: 18.45,
    progress: 18.45,
  },
  {
    title: 'Number of customers',
    value: '1,240',
    change: -10.35,
    progress: 10.35,
  },
  {
    title: 'Average order value',
    value: '65.49',
    prefix: '$',
    suffix: ' USD',
    change: 5.92,
    progress: 5.92,
  },
  {
    title: 'Products sold in the period',
    variant: 'secondary',
    value: '3,750',
    change: 22.61,
    progress: 22.61,
  },
  {
    title: 'Total sales in period',
    variant: 'warning',
    value: '24,500',
    prefix: '$',
    change: 18.45,
    progress: 18.45,
  },
  {
    title: 'Number of customers',
    value: '1,240',
    change: -10.35,
    progress: 10.35,
  },
]

export type TrafficType = {
  pageLink: string
  views: number
  unique: number
}

export const trafficData: TrafficType[] = [
  {
    pageLink: '/dashboard',
    views: 9.8,
    unique: 8.5,
  },
  {
    pageLink: '/ecommerce-index',
    views: 8.2,
    unique: 7.1,
  },
  {
    pageLink: '/apps/projects-overview',
    views: 7.6,
    unique: 6.2,
  },
  {
    pageLink: '/pages/contact',
    views: 5.9,
    unique: 4.8,
  },
  {
    pageLink: '/support/faq',
    views: 5.2,
    unique: 4.3,
  },
  {
    pageLink: '/login',
    views: 4.7,
    unique: 3.9,
  },
]

export type TopCountryType = {
  name: string
  image: string
  value: string
  change: number
}

export const topCountryData: TopCountryType[] = [
  { name: 'Germany', image: deFlag, value: '10,412', change: 1.5 },
  { name: 'France', image: frFlag, value: '8,934', change: -0.8 },
  { name: 'India', image: inFlag, value: '14,217', change: 3.2 },
  { name: 'United States', image: usFlag, value: '18,522', change: 2.1 },
  { name: 'United Kingdom', image: gbFlag, value: '7,614', change: -1.2 },
  { name: 'Canada', image: caFlag, value: '6,221', change: 0.9 },
  { name: 'Japan', image: jpFlag, value: '5,785', change: 0.0 },
  { name: 'Australia', image: auFlag, value: '4,918', change: 1.1 },
  { name: 'Brazil', image: brFlag, value: '3,874', change: -0.5 },
  { name: 'Italy', image: itFlag, value: '4,105', change: 0.7 },
]

export type CommentType = {
  name: string
  image: string
  date: string
  time: string
  message: string
  views: string
  likes: number
  comments: number
  replies?: CommentType[]
}

export const commentData: CommentType[] = [
  {
    name: 'Liam Carter',
    image: user8,
    date: '15 Apr 2025',
    time: '09:20AM',
    message: 'Loving the new dashboard update! The UI feels much smoother and more intuitive now. Great job!',
    views: '1.2K',
    likes: 320,
    comments: 14,
    replies: [
      {
        name: 'Nina Bryant',
        image: user10,
        date: '15 Apr 2025',
        time: '10:00AM',
        message: 'Totally agree! The load speed is noticeably faster too.',
        views: '860',
        likes: 150,
        comments: 6,
      },
      {
        name: 'Sophie Allen',
        image: user3,
        date: '15 Apr 2025',
        time: '12:10PM',
        message: 'Hope we get more dark mode themes next!',
        views: '580',
        likes: 90,
        comments: 3,
      },
    ],
  },
]

export type ChatUser = {
  name: string
  image: string
}

export type ChatMessageType = {
  message: string
  time: string
  user: ChatUser
}

export const chatUser: ChatUser[] = [
  { name: 'Carlos Méndez', image: user5 },
  { name: 'Sophie Laurent', image: user2 },
]

export const chatMessageData: ChatMessageType[] = [
  {
    message: 'Hey! Are you available for a quick call? 📞',
    time: '08:55 am',
    user: chatUser[0],
  },
  {
    message: 'Sure, give me 5 minutes. Just wrapping something up.',
    time: '08:57 am',
    user: chatUser[1],
  },
  {
    message: "Perfect. Let me know when you're ready 👍",
    time: '08:58 am',
    user: chatUser[0],
  },
  {
    message: 'Ready now. Calling you!',
    time: '09:00 am',
    user: chatUser[1],
  },
  {
    message: 'Thanks for your time earlier!',
    time: '09:45 am',
    user: chatUser[0],
  },
  {
    message: 'Of course! It was a productive discussion.',
    time: '09:46 am',
    user: chatUser[1],
  },
  {
    message: 'I’ll send over the updated files by noon.',
    time: '09:50 am',
    user: chatUser[0],
  },
]

export type FileItemType = {
  name: string
  size: number
  icon: string
  images: string[]
}

export const fileItemData: FileItemType[] = [
  {
    name: 'Meeting-Notes.docx',
    size: 1258291,
    icon: 'tabler:file-text',
    images: [user4, user7, user1, user2],
  },
  {
    name: 'Design-Specs.pdf',
    size: 3774874,
    icon: 'tabler:file-type-pdf',
    images: [user8, user2, user6, user9, user10],
  },
  {
    name: 'Assets-Package.zip',
    size: 7759462,
    icon: 'tabler:file-type-zip',
    images: [user1, user6],
  },
  {
    name: 'Marketing-Plan.pptx',
    size: 5242880,
    icon: 'tabler:file-type-ppt',
    images: [user10, user4, user1, user3, user6],
  },
  {
    name: 'Wireframe.png',
    size: 839680,
    icon: 'tabler:photo',
    images: [user9],
  },
]

export type MeetingType = {
  title: string
  subtitle: string
  variant: string
  users: {
    image?: string
    name: string
  }[]
  icon: string
}

export const meetingData: MeetingType[] = [
  {
    title: 'Design Review Meeting',
    subtitle: '30 minute session with UI/UX team',
    variant: 'warning',
    users: [
      { image: user5, name: 'Liam Carter' },
      { image: user6, name: 'Zoe Miles' },
      {
        name: 'D',
      },
    ],
    icon: 'tabler:brand-figma',
  },
  {
    title: 'Sprint Planning Session',
    subtitle: '1 hour agile team meeting',
    variant: 'success',
    users: [
      { image: user7, name: 'Ava Lee' },
      { image: user8, name: 'Ethan King' },
      { image: user9, name: 'Lucas White' },
    ],
    icon: 'tabler:calendar-event',
  },
]

export type StatisticCard3Type = {
  title: string
  subtitle: string
  icon: string
  variant: string
  value: number
  prefix?: string
  suffix?: string
}

export const statisticCard3Data: StatisticCard3Type[] = [
  {
    title: 'Total Sales',
    subtitle: 'Monthly Total Sales',
    icon: 'tabler:credit-card',
    variant: 'success',
    value: 320,
    prefix: '$',
    suffix: 'K',
  },
  {
    title: 'Total Orders',
    subtitle: 'Monthly Total Orders',
    icon: 'tabler:package',
    variant: 'primary',
    value: 245,
  },
  {
    title: 'New Customers',
    subtitle: 'Monthly New Customers',
    icon: 'tabler:users',
    variant: 'info',
    value: 4382,
  },
  {
    title: 'Revenue',
    subtitle: 'Monthly Revenue',
    icon: 'tabler:chart-bar',
    variant: 'warning',
    value: 89.45,
    prefix: '$',
    suffix: 'K',
  },
]

export type StatisticCard4Type = {
  title: string
  icon: string
  variant: string
  value: number
  prefix: string
  suffix: string
}

export const statisticCard4Data: StatisticCard4Type[] = [
  {
    title: 'Total Property Value',
    icon: 'tabler:home-heart',
    variant: 'primary',
    value: 150,
    prefix: '$',
    suffix: 'M',
  },
  {
    title: 'Monthly Rental Income',
    icon: 'tabler:wallet',
    variant: 'secondary',
    value: 80,
    prefix: '$',
    suffix: 'M',
  },
  {
    title: 'Average Property Price',
    icon: 'tabler:tags',
    variant: 'info',
    value: 500,
    prefix: '$',
    suffix: 'K',
  },
  {
    title: 'Latest Property Sale',
    icon: 'tabler:building',
    variant: 'danger',
    value: 1.2,
    prefix: '$',
    suffix: 'M',
  },
]

export type StatisticCard5Type = {
  title: string
  value: number
  description: string
  status: string
}

export const statisticCard5Data: StatisticCard5Type[] = [
  {
    title: 'Backend API Integration',
    value: 72.5,
    description: 'Estimated completion: 2 days.',
    status: 'in-progress',
  },
  {
    title: 'UI Design',
    value: 100,
    description: 'Delivered yesterday at 5:00 pm.',
    status: 'completed',
  },
  {
    title: 'Database Optimization',
    value: 45,
    description: 'Next review: Monday 10:00 am.',
    status: 'pending',
  },
  {
    title: 'Server Uptime',
    value: 99.9,
    description: 'Last downtime: 7 days ago.',
    status: 'stable',
  },
]

export type StatisticCard6Type = {
  title: string
  icon: string
  variant: string
  value: number
  prefix?: string
  suffix?: string
}

export const statisticCard6Data: StatisticCard6Type[] = [
  {
    title: 'Total Property Value',
    icon: 'tabler:building-skyscraper',
    variant: 'primary',
    value: 150,
    prefix: '$',
    suffix: 'M',
  },
  {
    title: 'Properties Sold',
    icon: 'tabler:home-dollar',
    variant: 'success',
    value: 320,
  },
  {
    title: 'Active Listings',
    icon: 'tabler:building-store',
    variant: 'warning',
    value: 180,
  },
  {
    title: 'Agents Available',
    icon: 'tabler:users-group',
    variant: 'info',
    value: 85,
  },
  {
    title: 'Upcoming Viewings',
    icon: 'tabler:calendar-time',
    variant: 'danger',
    value: 42,
  },
  {
    title: 'New Constructions',
    icon: 'tabler:building-warehouse',
    variant: 'secondary',
    value: 27,
  },
]
