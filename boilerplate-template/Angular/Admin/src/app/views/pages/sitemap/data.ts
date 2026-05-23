export type SitemapItem = {
  title: string
  href?: string
  icon?: string
  itemClassName?: string
  children?: SitemapItem[]
}

export const sitemapData: { title: string; items: SitemapItem[] }[] = [
  {
    title: 'Dashboard & Pages',
    items: [
      {
        title: 'Dashboards',
        href: '',
        children: [
          { title: 'Analytics', href: '' },
          { title: 'CRM', href: '' },
          { title: 'Sales', href: '' },
          { title: 'Minimal', href: '' },
          { title: 'eCommerce', href: '' },
        ],
      },
      {
        title: 'Profile',
        href: '',
        children: [
          { title: 'Overview', href: '' },
          { title: 'Edit', href: '' },
          { title: 'Security', href: '' },
        ],
      },
      { title: 'Help Center', href: '' },
      { title: 'Login', href: '' },
      { title: 'Register', href: '' },
    ],
  },
  {
    title: 'Applications',
    items: [
      { title: 'Calendar', icon: 'calendar', href: '' },
      {
        title: 'Email',
        icon: 'mail',
        href: '',
        children: [
          { title: 'Inbox', href: '' },
          { title: 'Read', href: '' },
          { title: 'Compose', href: '' },
        ],
      },
      {
        title: 'Users',
        icon: 'users',
        href: '',
        children: [
          { title: 'List', href: '' },
          { title: 'Add User', href: '' },
          { title: 'Roles', href: '' },
        ],
      },
      {
        title: 'Projects',
        icon: 'briefcase',
        href: '',
        children: [
          { title: 'Overview', href: '' },
          { title: 'Create', href: '' },
          { title: 'Tasks', href: '' },
        ],
      },
    ],
  },
  {
    title: 'Reports & Settings',
    items: [
      {
        itemClassName: 'link-primary',
        title: 'Reports',
        icon: 'chart-bar',
        href: '',
        children: [
          { title: 'Sales', href: '' },
          { title: 'Users', href: '' },
          { title: 'Performance', href: '' },
        ],
      },
      {
        itemClassName: 'link-info',
        title: 'Billing',
        icon: 'wallet',
        href: '',
        children: [
          { title: 'Invoices', href: '' },
          { title: 'Payments', href: '' },
          { title: 'Methods', href: '' },
        ],
      },
      {
        itemClassName: 'link-danger',
        title: 'Settings',
        icon: 'settings',
        href: '',
        children: [
          { title: 'General', href: '' },
          { title: 'Appearance', href: '' },
          { title: 'Integrations', href: '' },
          { title: 'Audit Logs', href: '' },
        ],
      },
      { itemClassName: 'link-reset', title: 'Logout', icon: 'logout', href: '' },
    ],
  },
]
