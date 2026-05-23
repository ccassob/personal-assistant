const user1 = 'assets/images/users/user-1.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'

export type TeamType = {
  name: string
  members: string[]
  description: string
  stats: {
    icon: string
    name: string
    count?: {
      value: number | string
      prefix?: string
      suffix?: string
    }
  }[]
  progress: number
  progressTitle: string
  updatedTime: string
  isNew?: boolean
}

export const teamData: TeamType[] = [
  {
    name: 'Design Team',
    members: [user7, user8, user9, user10],
    description: 'The Design Team focuses on creating intuitive user experiences and visually appealing interfaces. We handle UI/UX design, prototyping, and brand consistency across all digital products.',
    stats: [
      { icon: 'layout-kanban', name: 'Projects', count: { value: 25 } },
      { icon: 'medal', name: 'Ranking', count: { value: 5, prefix: '#' } },
      { icon: 'wallet', name: 'Budgets', count: { value: 20.3, prefix: '$', suffix: 'M' } },
    ],
    progress: 65,
    updatedTime: '1 hour ago',
    isNew: true,
    progressTitle: 'Status of current project',
  },
  {
    name: 'Development Team',
    members: [user1, user2, user3, user4, user5, user6],
    description: 'The Development Team builds and maintains core product features, ensuring robust performance, scalability, and code quality across all platforms. We specialize in full-stack development and agile delivery.',
    stats: [
      { icon: 'layout-kanban', name: 'Projects', count: { value: 42 } },
      { icon: 'medal', name: 'Ranking', count: { value: 2, prefix: '#' } },
      { icon: 'wallet', name: 'Budgets', count: { value: 32.7, prefix: '$', suffix: 'M' } },
    ],
    progress: 78,
    updatedTime: '30 mins ago',
    progressTitle: 'Status of current project',
  },
  {
    name: 'Administrator Team',
    members: [user10, user9, user8],
    description: 'The Administrator Team manages system settings, user roles, permissions, and ensures data security and compliance across platforms.',
    stats: [
      { icon: 'list-details', name: 'Tasks', count: { value: 18 } },
      { icon: 'medal', name: 'Ranking', count: { value: 6, prefix: '#' } },
      { icon: 'user-hexagon', name: 'Access', count: { value: 'Full' } },
    ],
    progress: 53,
    updatedTime: '45 mins ago',
    progressTitle: 'Status of current ops',
  },
  {
    name: 'Finance Team',
    members: [user2, user10, user8, user3, user1],
    description: 'The Finance Team handles budgeting, forecasts, and financial analysis. We ensure transparency and strategic alignment with business goals.',
    stats: [
      { icon: 'report', name: 'Reports', count: { value: 30 } },
      { icon: 'medal', name: 'Ranking', count: { value: 3, prefix: '#' } },
      {
        icon: 'wallet',
        name: 'Budgets',
        count: { value: 28.9, prefix: '$', suffix: 'M' },
      },
    ],
    progress: 72,
    updatedTime: '20 mins ago',
    progressTitle: 'Q2 Audit Progress',
  },
  {
    name: 'Marketing Team',
    members: [user9, user3, user5, user7, user10, user1, user2],
    description: 'The Marketing Team manages branding, campaigns, and audience engagement. We drive growth through creative storytelling and data-driven strategies.',
    stats: [
      { icon: 'speakerphone', name: 'Campaigns', count: { value: 18 } },
      { icon: 'chart-donut', name: 'Reach', count: { value: 1.2, suffix: 'M' } },
      {
        icon: 'wallet',
        name: 'Budgets',
        count: { value: 12.4, prefix: '$', suffix: 'M' },
      },
    ],
    progress: 60,
    updatedTime: '45 mins ago',
    progressTitle: 'Campaign Completion',
  },
  {
    name: 'Graphic Team',
    members: [user9, user1, user10, user7, user6],
    description: 'The Graphic Team brings visual concepts to life. We handle illustrations, digital assets, brand collateral, and motion graphics to support product and marketing teams.',
    stats: [
      { icon: 'brush', name: 'Designs', count: { value: 36 } },
      { icon: 'photo', name: 'Assets', count: { value: 89 } },
      {
        icon: 'wallet',
        name: 'Budgets',
        count: { value: 8.1, prefix: '$', suffix: 'M' },
      },
    ],
    progress: 82,
    updatedTime: '10 mins ago',
    progressTitle: 'Current Load',
  },
]
