export type InvoiceType = {
  id: string
  date: string
  user: {
    name: string
    image?: string
    email: string
  }
  purchase: string
  amount: string
  status: 'paid' | 'pending' | 'overdue' | 'draft'
}

export const invoiceData: InvoiceType[] = [
  {
    id: 'INS-0120010',
    date: 'Feb 2 - Feb 10, 2025',
    user: {
      name: 'Emily Parker',
      image: 'assets/images/users/user-7.jpg',
      email: 'emily@startupwave.io',
    },
    purchase: 'Bootstrap - Extended License',
    amount: '$999.00',
    status: 'paid',
  },
  {
    id: 'INS-0120009',
    date: 'Feb 5 - Feb 12, 2025',
    user: {
      name: 'Michael Scott',
      email: 'michael@dundermifflin.com',
    },
    purchase: 'CRM Dashboard - Regular License',
    amount: '$249.00',
    status: 'pending',
  },
  {
    id: 'INS-0120008',
    date: 'Jan 10 - Jan 15, 2025',
    user: {
      name: 'Samantha Reed',
      image: 'assets/images/users/user-3.jpg',
      email: 'samantha@alphatech.com',
    },
    purchase: 'Landing Page - Agency Pack',
    amount: '$349.00',
    status: 'overdue',
  },
  {
    id: 'INS-0120007',
    date: 'Mar 1 - Mar 5, 2025',
    user: {
      name: 'Jonathan Lee',
      image: 'assets/images/users/user-2.jpg',
      email: 'jonathan@zenflow.io',
    },
    purchase: 'Task Manager - SaaS Version',
    amount: '$799.00',
    status: 'draft',
  },
  {
    id: 'INS-0120006',
    date: 'Mar 10 - Mar 15, 2025',
    user: {
      name: 'Carlos Diaz',
      email: 'carlos@themeverse.com',
    },
    purchase: 'Admin Panel - Developer License',
    amount: '$1,199.00',
    status: 'paid',
  },
  {
    id: 'INS-0120005',
    date: 'Mar 20 - Mar 25, 2025',
    user: {
      name: 'Lisa Brown',
      image: 'assets/images/users/user-4.jpg',
      email: 'lisa@digitize.io',
    },
    purchase: 'Analytics Suite - Enterprise',
    amount: '$1,499.00',
    status: 'pending',
  },
  {
    id: 'INS-0120004',
    date: 'Apr 1 - Apr 7, 2025',
    user: {
      name: 'Ryan Mitchell',
      email: 'ryan@bizsol.com',
    },
    purchase: 'Sales App - Regular License',
    amount: '$499.00',
    status: 'draft',
  },
  {
    id: 'INS-0120003',
    date: 'Apr 8 - Apr 12, 2025',
    user: {
      name: 'Nina Hughes',
      image: 'assets/images/users/user-8.jpg',
      email: 'nina@creativelabs.io',
    },
    purchase: 'Marketing Kit - Extended License',
    amount: '$899.00',
    status: 'paid',
  },
  {
    id: 'INS-0120002',
    date: 'Apr 10 - Apr 14, 2025',
    user: {
      name: 'Oliver Grant',
      image: 'assets/images/users/user-9.jpg',
      email: 'oliver@nextgenapps.com',
    },
    purchase: 'Mobile Kit - Standard Plan',
    amount: '$599.00',
    status: 'pending',
  },
  {
    id: 'INS-0120001',
    date: 'Apr 15 - Apr 20, 2025',
    user: {
      name: 'Sophia Kim',
      image: 'assets/images/users/user-10.jpg',
      email: 'sophia@pixelhub.io',
    },
    purchase: 'UI Kit - Commercial License',
    amount: '$749.00',
    status: 'overdue',
  },
]
