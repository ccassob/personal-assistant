const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const usFlag = 'assets/images/flags/us.svg'
const arFlag = 'assets/images/flags/ar.svg'
const auFlag = 'assets/images/flags/au.svg'
const deFlag = 'assets/images/flags/de.svg'
const gbFlag = 'assets/images/flags/gb.svg'
const frFlag = 'assets/images/flags/fr.svg'
const inFlag = 'assets/images/flags/in.svg'
const itFlag = 'assets/images/flags/it.svg'
const jpFlag = 'assets/images/flags/jp.svg'
const ruFlag = 'assets/images/flags/ru.svg'

export type CustomerType = {
  customer: {
    name: string
    image: string
  }
  email: string
  phone: string
  country: {
    flag: string
    name: string
  }
  joinedDate: string
  joinedTime: string
  orders: number
  totalSpends: string
}

export const customerData: CustomerType[] = [
  {
    customer: {
      name: 'Carlos Méndez',
      image: user7,
    },
    email: 'carlos@techlaunch.mx',
    phone: '+1 (415) 992-3412',
    country: {
      flag: usFlag,
      name: 'United States',
    },
    joinedDate: '2 Feb, 2024',
    joinedTime: '08:34 AM',
    orders: 58,
    totalSpends: '$198.25',
  },
  {
    customer: {
      name: 'Sophie Laurent',
      image: user2,
    },
    email: 'sophie.laurent@eurotech.fr',
    phone: '+33 6 12 34 56 78',
    country: {
      flag: frFlag,
      name: 'France',
    },
    joinedDate: '15 Mar, 2024',
    joinedTime: '10:22 AM',
    orders: 42,
    totalSpends: '$245.80',
  },
  {
    customer: {
      name: 'Akira Tanaka',
      image: user3,
    },
    email: 'akira.tanaka@techjapan.co.jp',
    phone: '+81 90-1234-5678',
    country: {
      flag: jpFlag,
      name: 'Japan',
    },
    joinedDate: '28 Jan, 2024',
    joinedTime: '03:15 PM',
    orders: 75,
    totalSpends: '$320.50',
  },
  {
    customer: {
      name: 'Emma Watson',
      image: user4,
    },
    email: 'emma.watson@britinnovate.uk',
    phone: '+44 7700 900123',
    country: {
      flag: gbFlag,
      name: 'United Kingdom',
    },
    joinedDate: '10 Apr, 2024',
    joinedTime: '09:47 AM',
    orders: 29,
    totalSpends: '$175.30',
  },
  {
    customer: {
      name: 'Lucas Schmidt',
      image: user5,
    },
    email: 'lucas.schmidt@techdeutsch.de',
    phone: '+49 151 23456789',
    country: {
      flag: deFlag,
      name: 'Germany',
    },
    joinedDate: '20 Feb, 2024',
    joinedTime: '02:10 PM',
    orders: 63,
    totalSpends: '$280.75',
  },
  {
    customer: {
      name: 'Isabella Rossi',
      image: user6,
    },
    email: 'isabella.rossi@italiatech.it',
    phone: '+39 333 4567890',
    country: {
      flag: itFlag,
      name: 'Italy',
    },
    joinedDate: '5 Mar, 2024',
    joinedTime: '11:25 AM',
    orders: 51,
    totalSpends: '$210.40',
  },
  {
    customer: {
      name: 'Mateo Vargas',
      image: user8,
    },
    email: 'mateo.vargas@latamtech.ar',
    phone: '+54 9 11 2345 6789',
    country: {
      flag: arFlag,
      name: 'Argentina',
    },
    joinedDate: '18 Apr, 2024',
    joinedTime: '04:50 PM',
    orders: 37,
    totalSpends: '$190.20',
  },
  {
    customer: {
      name: 'Priya Sharma',
      image: user9,
    },
    email: 'priya.sharma@indotech.in',
    phone: '+91 98765 43210',
    country: {
      flag: inFlag,
      name: 'India',
    },
    joinedDate: '10 Jan, 2024',
    joinedTime: '06:30 AM',
    orders: 82,
    totalSpends: '$350.90',
  },
  {
    customer: {
      name: 'Liam O’Connor',
      image: user10,
    },
    email: 'liam.oconnor@ausinnovate.au',
    phone: '+61 400 123 456',
    country: {
      flag: auFlag,
      name: 'Australia',
    },
    joinedDate: '25 Mar, 2024',
    joinedTime: '01:15 PM',
    orders: 45,
    totalSpends: '$230.65',
  },
  {
    customer: {
      name: 'Olga Petrova',
      image: user1,
    },
    email: 'olga.petrova@rus-tech.ru',
    phone: '+7 912 345 67 89',
    country: {
      flag: ruFlag,
      name: 'Russia',
    },
    joinedDate: '8 Feb, 2024',
    joinedTime: '07:40 AM',
    orders: 68,
    totalSpends: '$295.15',
  },
]
