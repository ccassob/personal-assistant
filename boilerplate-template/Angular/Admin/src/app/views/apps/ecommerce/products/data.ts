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

export type StatType = {
  title: string
  value: number
  prefix?: string
  suffix?: string
  badge: string
  icon: string
  variant: string
  metric: string
  metricValue: string
}

export const statData: StatType[] = [
  {
    title: 'Products',
    value: 1240,
    badge: '+24 New',
    icon: 'package',
    variant: 'primary',
    metric: 'Active Listings',
    metricValue: '980',
  },
  {
    title: 'Orders',
    value: 8540,
    badge: '+120 New',
    icon: 'shopping-cart',
    variant: 'secondary',
    metric: 'Total Orders',
    metricValue: '105K',
  },
  {
    title: 'Sales',
    value: 9860,
    prefix: '$',
    badge: '+8.2 New',
    icon: 'currency-dollar',
    variant: 'success',
    metric: "Today's Sales",
    metricValue: '$156K',
  },
  {
    title: 'Customers',
    value: 2945,
    badge: '+36 New',
    icon: 'users',
    variant: 'info',
    metric: 'Total Customers',
    metricValue: '58,320',
  },
  {
    title: 'Revenue',
    value: 1.2,
    suffix: 'M',
    prefix: '$',
    badge: '+4.5 New',
    icon: 'chart-bar',
    variant: 'warning',
    metric: 'Total Revenue',
    metricValue: '$12.8M',
  },
]

export type ProductType = {
  id: string
  image: string
  name: string
  brand: string
  sku: string
  category: string
  stock: number
  price: string
  orders: number
  rating: number
  reviews: number
  status: 'published' | 'out-of-stock' | 'pending'
  lastModified: string
  date: string
  time: string
}

export const productData: ProductType[] = [
  {
    id: 'WB-10245',
    image: product1,
    name: 'Wireless Earbuds',
    brand: 'My Furniture',
    sku: 'WB-10245',
    category: 'Electronics',
    stock: 56,
    price: '$59.99',
    orders: 124,
    rating: 5,
    reviews: 87,
    status: 'published',
    lastModified: '18 Apr, 2025 12:24 PM',
    date: '18 Apr, 2025',
    time: '12:24 PM',
  },
  {
    id: 'SL-89012',
    image: product2,
    name: 'Smart LED Desk Lamp',
    brand: 'BrightLite',
    sku: 'SL-89012',
    category: 'Home & Office',
    stock: 32,
    price: '$39.49',
    orders: 78,
    rating: 4,
    reviews: 54,
    status: 'pending',
    lastModified: '22 Apr, 2025 09:45 AM',
    date: '22 Apr, 2025',
    time: '09:45 AM',
  },
  {
    id: 'RS-20450',
    image: product3,
    name: "Men's Running Shoes",
    brand: 'ActiveWear Co.',
    sku: 'RS-20450',
    category: 'Fashion',
    stock: 120,
    price: '$89.00',
    orders: 231,
    rating: 5,
    reviews: 142,
    status: 'published',
    lastModified: '24 Apr, 2025 03:10 PM',
    date: '24 Apr, 2025',
    time: '03:10 PM',
  },
  {
    id: 'FT-67123',
    image: product4,
    name: 'Fitness Tracker Watch',
    brand: 'FitPulse',
    sku: 'FT-67123',
    category: 'Fitness',
    stock: 78,
    price: '$49.95',
    orders: 198,
    rating: 4,
    reviews: 89,
    status: 'published',
    lastModified: '23 Apr, 2025 10:12 AM',
    date: '23 Apr, 2025',
    time: '10:12 AM',
  },
  {
    id: 'GM-72109',
    image: product5,
    name: 'Gaming Mouse RGB',
    brand: 'HyperClick',
    sku: 'GM-72109',
    category: 'Gaming',
    stock: 120,
    price: '$29.99',
    orders: 243,
    rating: 3,
    reviews: 102,
    status: 'published',
    lastModified: '19 Apr, 2025 05:56 PM',
    date: '19 Apr, 2025',
    time: '05:56 PM',
  },
  {
    id: 'FC-31220',
    image: product6,
    name: 'Modern Lounge Chair',
    brand: 'UrbanLiving',
    sku: 'FC-31220',
    category: 'Furniture',
    stock: 24,
    price: '$199.00',
    orders: 38,
    rating: 5,
    reviews: 27,
    status: 'out-of-stock',
    lastModified: '18 Apr, 2025 11:30 AM',
    date: '18 Apr, 2025',
    time: '11:30 AM',
  },
  {
    id: 'TY-00788',
    image: product7,
    name: 'Plush Toy Bear',
    brand: 'Softies',
    sku: 'TY-00788',
    category: 'Toys',
    stock: 150,
    price: '$15.99',
    orders: 305,
    rating: 4,
    reviews: 120,
    status: 'published',
    lastModified: '17 Apr, 2025 04:21 PM',
    date: '17 Apr, 2025',
    time: '04:21 PM',
  },
  {
    id: 'TV-5588',
    image: product8,
    name: '55" Ultra HD Smart TV',
    brand: 'ViewMaster',
    sku: 'TV-5588',
    category: 'Electronics',
    stock: 64,
    price: '$499.00',
    orders: 142,
    rating: 4,
    reviews: 88,
    status: 'published',
    lastModified: '25 Apr, 2025 10:10 AM',
    date: '25 Apr, 2025',
    time: '10:10 AM',
  },
  {
    id: 'IMAC-M3-24',
    image: product9,
    name: 'Apple iMac 24" M3',
    brand: 'Apple',
    sku: 'IMAC-M3-24',
    category: 'Computers',
    stock: 18,
    price: '$1399.00',
    orders: 29,
    rating: 5,
    reviews: 16,
    status: 'pending',
    lastModified: '24 Apr, 2025 02:14 PM',
    date: '24 Apr, 2025',
    time: '02:14 PM',
  },
  {
    id: 'SWPX2-GL',
    image: product10,
    name: 'Smart Watch Pro X2',
    brand: 'FitTech',
    sku: 'SWPX2-GL',
    category: 'Wearables',
    stock: 85,
    price: '$149.5',
    orders: 197,
    rating: 4,
    reviews: 65,
    status: 'published',
    lastModified: '23 Apr, 2025 08:00 AM',
    date: '23 Apr, 2025',
    time: '08:00 AM',
  },
]
