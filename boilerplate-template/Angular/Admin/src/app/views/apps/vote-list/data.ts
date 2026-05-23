const user10 = 'assets/images/users/user-10.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'

export type VoteListItemType = {
  title: string
  description: string
  user: {
    name: string
    image: string
  }
  postedOn: string
  category: string
  comments: number
  endsIn: string
  votes: number
  status: 'open' | 'closed' | 'starting-soon'
  userVote?: 'up' | 'down'
}

export const voteListData: VoteListItemType[] = [
  {
    title: 'Should remote work be a permanent option for all employees?',
    description: 'Remote work has seen a massive rise in popularity since 2020. This vote explores whether it should remain a flexible option moving forward.',
    user: {
      name: 'Emily Parker',
      image: user7,
    },
    postedOn: 'Jan 12, 2025',
    category: 'Workplace',
    comments: 89,
    endsIn: '5 days',
    votes: 35,
    status: 'closed',
  },
  {
    title: 'Should companies implement a 4-day workweek?',
    description: 'As work-life balance becomes a higher priority, many advocate for a shorter workweek to improve productivity and employee well-being.',
    user: {
      name: 'Daniel Stone',
      image: user4,
    },
    postedOn: 'Feb 1, 2025',
    category: 'Productivity',
    comments: 54,
    endsIn: '4 days',
    votes: 52,
    status: 'open',
    userVote: 'up',
  },
  {
    title: 'Should AI be part of everyday business operations?',
    description: 'As AI becomes more accessible, businesses are debating its integration into daily operations for tasks like customer support and analysis.',
    user: {
      name: 'Liam Torres',
      image: user8,
    },
    postedOn: 'Mar 3, 2025',
    category: 'Technology',
    comments: 112,
    endsIn: '2 days',
    votes: 78,
    status: 'open',
  },
  {
    title: 'Should companies go fully remote?',
    description: 'With the success of remote setups, some argue that physical offices are no longer necessary. Others miss in-person collaboration.',
    user: {
      name: 'Sophia Ray',
      image: user6,
    },
    postedOn: 'Jan 28, 2025',
    category: 'Remote',
    comments: 40,
    endsIn: '3 days',
    votes: 21,
    status: 'closed',
  },
  {
    title: 'Is a degree still essential in tech hiring?',
    description: 'Many argue that skills matter more than formal education in today’s tech industry. Should degrees still be a hiring requirement?',
    user: {
      name: 'Jordan Smith',
      image: user9,
    },
    postedOn: 'Jan 10, 2025',
    category: 'Career',
    comments: 87,
    endsIn: '1 day',
    votes: 96,
    status: 'open',
  },
  {
    title: 'Should meetings be reduced to increase efficiency?',
    description: 'Teams spend hours in meetings weekly. Is cutting down on them the secret to improved focus and output?',
    user: {
      name: 'Rachel Lee',
      image: user10,
    },
    postedOn: 'Feb 5, 2025',
    category: 'Efficiency',
    comments: 33,
    endsIn: '6 days',
    votes: 40,
    status: 'starting-soon',
    userVote: 'down',
  },
  {
    title: 'Is hybrid work the best model moving forward?',
    description: 'Hybrid setups offer flexibility and collaboration—but do they satisfy everyone? Let’s vote on the future of work.',
    user: {
      name: 'Harvey Nash',
      image: user3,
    },
    postedOn: 'Jan 18, 2025',
    category: 'Hybrid',
    comments: 61,
    endsIn: '2 days',
    votes: 65,
    status: 'closed',
  },
]
