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

export type SideBarItemType = {
  name: string
  icon: string
  badge?: {
    label: string
    className: string
  }
}

export const sidebarMenuItemData: SideBarItemType[] = [
  { name: 'My Files', icon: 'folder', badge: { label: '12', className: 'bg-danger-subtle text-danger' } },
  { name: 'Shared with Me', icon: 'share' },
  { name: 'Recent', icon: 'clock' },
  { name: 'Favourites', icon: 'star' },
  { name: 'Downloads', icon: 'download' },
  { name: 'Trash', icon: 'trash' },
]

export type CategoryType = {
  name: string
  icon: string
  iconClassName?: string
  badge?: {
    label: string
    className: string
  }
}

export const categoryData: CategoryType[] = [
  { name: 'Work', icon: 'chart-donut', iconClassName: 'text-primary' },
  { name: 'Projects', icon: 'chart-donut', iconClassName: 'text-secondary' },
  { name: 'Media', icon: 'chart-donut', iconClassName: 'text-info' },
  { name: 'Documents', icon: 'chart-donut', iconClassName: 'text-warning' },
]

export type FileRecordType = {
  name: string
  icon: string
  size: number
  type: string
  modifiedDate: string
  user: {
    email: string
    image: string
  }
  sharedWith: {
    image: string
  }[]
  isFavorite: boolean
  selected?: boolean
}

export const fileRecordData: FileRecordType[] = [
  {
    name: 'Project Overview Video',
    icon: 'video',
    size: 120000000,
    type: 'MP4',
    modifiedDate: 'April 2, 2025',
    user: {
      email: 'john@techgroup.com',
      image: user3,
    },
    sharedWith: [{ image: user5 }, { image: user7 }, { image: user6 }, { image: user4 }],
    isFavorite: false,
  },
  {
    name: 'Team Meeting Video',
    icon: 'video',
    size: 200000000,
    type: 'MP4',
    modifiedDate: 'April 15, 2025',
    user: {
      email: 'michael@devteam.com',
      image: user4,
    },
    sharedWith: [{ image: user2 }, { image: user3 }, { image: user5 }],
    isFavorite: false,
  },
  {
    name: 'Marketing Strategy Design',
    icon: 'brand-figma',
    size: 150000000,
    type: 'Figma',
    modifiedDate: 'April 20, 2025',
    user: {
      email: 'susan@marketing.com',
      image: user2,
    },
    sharedWith: [{ image: user1 }, { image: user3 }, { image: user6 }, { image: user9 }],
    isFavorite: false,
  },
  {
    name: 'Client Proposal PDF',
    icon: 'file-type-pdf',
    size: 45000000,
    type: 'PDF',
    modifiedDate: 'May 5, 2025',
    user: {
      email: 'mark@clientservices.com',
      image: user8,
    },
    sharedWith: [{ image: user2 }, { image: user4 }, { image: user7 }],
    isFavorite: false,
  },
  {
    name: 'Database Schema',
    icon: 'database',
    size: 30000000,
    type: 'MySQL',
    modifiedDate: 'April 1, 2025',
    user: {
      email: 'alex@creatix.io',
      image: user2,
    },
    sharedWith: [{ image: user4 }, { image: user8 }],
    isFavorite: false,
  },
  {
    name: 'Website Script',
    icon: 'code',
    size: 15000000,
    type: 'JS',
    modifiedDate: 'April 2, 2025',
    user: {
      email: 'john@techgroup.com',
      image: user3,
    },
    sharedWith: [{ image: user5 }, { image: user7 }, { image: user6 }, { image: user4 }],
    isFavorite: false,
  },
  {
    name: 'Dependency Package',
    icon: 'package',
    size: 5000000,
    type: 'DEP',
    modifiedDate: 'April 15, 2025',
    user: {
      email: 'michael@devteam.com',
      image: user4,
    },
    sharedWith: [{ image: user2 }, { image: user3 }, { image: user5 }],
    isFavorite: false,
  },
  {
    name: 'Internet Portal',
    icon: 'folder',
    size: 87000000,
    type: 'Folder',
    modifiedDate: 'March 10, 2025',
    user: {
      email: 'emma@devcore.com',
      image: user6,
    },
    sharedWith: [{ image: user7 }, { image: user9 }, { image: user10 }, { image: user3 }, { image: user8 }],
    isFavorite: false,
  },
  {
    name: 'Podcast Episode 12',
    icon: 'music',
    size: 55000000,
    type: 'Audio',
    modifiedDate: 'April 1, 2025',
    user: {
      email: 'alex@creatix.io',
      image: user2,
    },
    sharedWith: [{ image: user4 }, { image: user8 }],
    isFavorite: false,
  },
]

export type FolderType = {
  name: string
  size: number
}

export const folderData: FolderType[] = [
  { name: 'Premium Multi', size: 2300000000 },
  { name: 'Material Design', size: 105300000 },
  { name: 'DashPro UI Kit', size: 512000000 },
  { name: 'VueStudio Pack', size: 880000000 },
  { name: 'Nextify Pro', size: 1100000000 },
  { name: 'Blazor Studio', size: 780000000 },
  { name: 'Angular Prime', size: 940000000 },
  { name: 'React Kit Pro', size: 1600000000 },
]
