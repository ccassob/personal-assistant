const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const kanban1 = 'assets/images/kanban/img-1.png'
const kanban2 = 'assets/images/kanban/img-2.png'
const kanban3 = 'assets/images/kanban/img-3.png'
const kanban4 = 'assets/images/kanban/img-4.png'

export type KanbanTaskType = {
  category: {
    name: string
    variant: string
  }
  title: string
  users: string[]
  date: string
  image?: string
  status: 'todo' | 'in-progress' | 'done' | 'in-review'
  progress?: number
}

export const kanbanTaskData: KanbanTaskType[] = [
  {
    category: {
      name: 'Design',
      variant: 'success',
    },
    title: 'AI Analytics Dashboard',
    users: [user2, user3, user5, user1],
    date: '25 May, 2025',
    status: 'todo',
    progress: 65,
  },
  {
    category: {
      name: 'Development',
      variant: 'warning',
    },
    title: 'Marketing Landing Page Redesign',
    users: [user6, user4, user8],
    date: '10 Jun, 2025',
    image: kanban1,
    status: 'todo',
  },
  {
    category: {
      name: 'UI/UX',
      variant: 'info',
    },
    title: 'E-Commerce Website Redesign',
    users: [user4, user6, user7, user8],
    date: '28 May, 2025',
    status: 'todo',
  },
  {
    category: {
      name: 'App Development',
      variant: 'warning',
    },
    title: 'Mobile App Redesign',
    users: [user1, user2, user3],
    date: '30 May, 2025',
    status: 'todo',
    progress: 80,
  },
  {
    category: {
      name: 'Marketing',
      variant: 'purple',
    },
    title: 'CRM System Upgrade',
    users: [user4],
    date: '30 May, 2025',
    image: kanban2,
    status: 'todo',
    progress: 45,
  },

  {
    category: {
      name: 'Testing',
      variant: 'info',
    },
    title: 'E-commerce Website QA Testing',
    users: [user3, user7, user9],
    date: '18 Jun, 2025',
    status: 'in-progress',
  },
  {
    category: {
      name: 'UI/UX',
      variant: 'info',
    },
    title: 'Mobile App Redesign',
    users: [user5, user2, user3, user9],
    date: '10 Jun, 2025',
    status: 'in-progress',
  },
  {
    category: {
      name: 'UI/UX Design',
      variant: 'success',
    },
    title: 'Website User Experience Overhaul',
    users: [user4, user5, user6],
    date: '15 June, 2025',
    status: 'in-progress',
    progress: 55,
  },
  {
    category: {
      name: 'Marketing',
      variant: 'danger',
    },
    title: 'Customer Engagement Platform Development',
    users: [user5, user6],
    date: '10 June, 2025',
    status: 'in-progress',
  },

  {
    category: {
      name: 'Design',
      variant: 'success',
    },
    title: 'AI Analytics Dashboard',
    users: [user2, user3, user5, user1],
    date: '25 May, 2025',
    image: kanban3,
    status: 'in-review',
    progress: 65,
  },
  {
    category: {
      name: 'Development',
      variant: 'warning',
    },
    title: 'Marketing Landing Page Redesign',
    users: [user6, user4, user8],
    date: '10 Jun, 2025',
    status: 'in-review',
  },
  {
    category: {
      name: 'UI/UX',
      variant: 'info',
    },
    title: 'E-Commerce Website Redesign',
    users: [user4, user6, user7, user8],
    date: '28 May, 2025',
    status: 'in-review',
  },
  {
    category: {
      name: 'Testing',
      variant: 'info',
    },
    title: 'E-commerce Website QA Testing',
    users: [user3, user7, user9],
    date: '18 Jun, 2025',
    status: 'done',
  },
  {
    category: {
      name: 'UI/UX',
      variant: 'info',
    },
    title: 'Mobile App Redesign',
    users: [user5, user2, user3, user9],
    date: '10 Jun, 2025',
    image: kanban4,
    status: 'done',
  },
]
