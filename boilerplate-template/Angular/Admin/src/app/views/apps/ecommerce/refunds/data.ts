const product1 = 'assets/images/products/1.png'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'
const product4 = 'assets/images/products/4.png'
const product5 = 'assets/images/products/5.png'
const product6 = 'assets/images/products/6.png'
const product7 = 'assets/images/products/7.png'
const product8 = 'assets/images/products/8.png'
const product9 = 'assets/images/products/9.png'
const product10 = 'assets/images/products/10.png'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const visa = 'assets/images/cards/visa.svg'
const mastercard = 'assets/images/cards/mastercard.svg'
const amex = 'assets/images/cards/american-express.svg'
const paypal = 'assets/images/cards/paypal.svg'

export type RefundStatType = {
  icon: string
  title: string
  value: number
  change: number
  iconClassName: string
  badgeClassName: string
}

export const refundStatData: RefundStatType[] = [
  {
    icon: 'credit-card-refund',
    title: 'Total Refund Requests',
    value: 2310,
    change: 5.42,
    iconClassName: 'text-bg-primary',
    badgeClassName: 'badge-soft-primary',
  },
  {
    icon: 'check',
    title: 'Approved Refunds',
    value: 1560,
    change: 3.18,
    iconClassName: 'text-bg-success',
    badgeClassName: 'badge-soft-success',
  },
  {
    icon: 'alarm-snooze',
    title: 'Pending Refunds',
    value: 430,
    change: -1.09,
    iconClassName: 'text-bg-warning',
    badgeClassName: 'badge-soft-warning',
  },
  {
    icon: 'x',
    title: 'Rejected Refunds',
    value: 210,
    change: -0.62,
    iconClassName: 'text-bg-danger',
    badgeClassName: 'badge-soft-danger',
  },
  {
    icon: 'bolt',
    title: 'Fully Refunded',
    value: 110,
    change: 2.41,
    iconClassName: 'text-bg-info',
    badgeClassName: 'badge-soft-info',
  },
]

export type RefundType = {
  orderId: string
  product: {
    name: string
    sku: string
    image: string
  }
  customer: {
    name: string
    email: string
    image: string
  }
  reason: string
  payment: {
    image: string
    type: 'card' | 'other'
    name?: string
    number?: string
  }
  amount: string
  status: 'pending' | 'approved' | 'rejected' | 'refunded'
  requestedDate: string
  processedDate?: string
}

export const refundData: RefundType[] = [
  {
    orderId: '#INV-10423',
    product: {
      name: 'NoiseCancel Headphones',
      sku: 'NC-900',
      image: product1,
    },
    customer: {
      name: 'Mason Carter',
      email: 'mason.carter@shopmail.com',
      image: user2,
    },
    reason: 'Damaged on arrival',
    payment: {
      image: visa,
      type: 'card',
      number: 'xxxx 7832',
    },
    amount: '$129.45',
    status: 'pending',
    requestedDate: '08 Oct 2025',
  },
  {
    orderId: '#INV-10407',
    product: {
      name: 'Smartwatch Pro',
      sku: 'SW-PRO',
      image: product2,
    },
    customer: {
      name: 'Sofia Williams',
      email: 'sofia.williams@shopmail.com',
      image: user5,
    },
    reason: 'Wrong size received',
    payment: {
      image: mastercard,
      type: 'card',
      number: 'xxxx 2294',
    },
    amount: '$79.99',
    status: 'approved',
    requestedDate: '05 Oct 2025',
    processedDate: '06 Oct 2025',
  },
  {
    orderId: '#INV-10388',
    product: {
      name: '4K Action Camera',
      sku: 'AC-4K',
      image: product3,
    },
    customer: {
      name: 'Liam Brown',
      email: 'liam.brown@shopmail.com',
      image: user3,
    },
    reason: 'No longer needed',
    payment: {
      image: amex,
      type: 'card',
      number: 'xxxx 1145',
    },
    amount: '$249.00',
    status: 'refunded',
    requestedDate: '30 Sep 2025',
    processedDate: '01 Oct 2025',
  },
  {
    orderId: '#INV-10352',
    product: {
      name: 'Bluetooth Speaker Mini',
      sku: 'BS-MINI',
      image: product4,
    },
    customer: {
      name: 'Emma Johnson',
      email: 'emma.johnson@shopmail.com',
      image: user7,
    },
    reason: 'Product not as described',
    payment: {
      image: paypal,
      type: 'other',
      name: 'PayPal',
    },
    amount: '$59.99',
    status: 'rejected',
    requestedDate: '25 Sep 2025',
  },
  {
    orderId: '#INV-10341',
    product: {
      name: 'Wireless Mouse',
      sku: 'WM-450',
      image: product5,
    },
    customer: {
      name: 'Oliver Garcia',
      email: 'oliver.garcia@shopmail.com',
      image: user8,
    },
    reason: 'Did not work as expected',
    payment: {
      image: visa,
      type: 'card',
      number: 'xxxx 9821',
    },
    amount: '$39.00',
    status: 'pending',
    requestedDate: '22 Sep 2025',
  },
  {
    orderId: '#INV-10322',
    product: {
      name: 'Ergonomic Office Chair',
      sku: 'CHR-550',
      image: product6,
    },
    customer: {
      name: 'Lucas Turner',
      email: 'lucas.turner@shopmail.com',
      image: user4,
    },
    reason: 'Incorrect color delivered',
    payment: {
      image: amex,
      type: 'card',
      number: 'xxxx 6730',
    },
    amount: '$199.00',
    status: 'approved',
    requestedDate: '20 Sep 2025',
    processedDate: '21 Sep 2025',
  },
  {
    orderId: '#INV-10305',
    product: {
      name: 'Portable Vacuum Cleaner',
      sku: 'VC-201',
      image: product7,
    },
    customer: {
      name: 'Charlotte Davis',
      email: 'charlotte.d@shopmail.com',
      image: user9,
    },
    reason: 'Missing accessories',
    payment: {
      image: mastercard,
      type: 'card',
      number: 'xxxx 8142',
    },
    amount: '$89.50',
    status: 'refunded',
    requestedDate: '16 Sep 2025',
    processedDate: '18 Sep 2025',
  },
  {
    orderId: '#INV-10293',
    product: {
      name: 'Gaming Keyboard RGB',
      sku: 'GK-88',
      image: product8,
    },
    customer: {
      name: 'Henry Martin',
      email: 'henry.martin@shopmail.com',
      image: user10,
    },
    reason: 'Keys not functioning',
    payment: {
      image: paypal,
      type: 'other',
      name: 'PayPal',
    },
    amount: '$119.00',
    status: 'rejected',
    requestedDate: '12 Sep 2025',
  },
  {
    orderId: '#INV-10275',
    product: {
      name: 'Fitness Tracker Band',
      sku: 'FT-900',
      image: product9,
    },
    customer: {
      name: 'Ella Rodriguez',
      email: 'ella.rodriguez@shopmail.com',
      image: user3,
    },
    reason: 'Did not sync with app',
    payment: {
      image: visa,
      type: 'card',
      number: 'xxxx 9082',
    },
    amount: '$49.99',
    status: 'pending',
    requestedDate: '08 Sep 2025',
  },
  {
    orderId: '#INV-10261',
    product: {
      name: 'Laptop Stand Adjustable',
      sku: 'LS-101',
      image: product10,
    },
    customer: {
      name: 'James Anderson',
      email: 'james.anderson@shopmail.com',
      image: user2,
    },
    reason: 'Package arrived late',
    payment: {
      image: mastercard,
      type: 'card',
      number: 'xxxx 3210',
    },
    amount: '$64.99',
    status: 'approved',
    requestedDate: '05 Sep 2025',
    processedDate: '06 Sep 2025',
  },
]
