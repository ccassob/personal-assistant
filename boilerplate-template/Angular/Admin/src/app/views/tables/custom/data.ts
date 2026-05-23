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

export type CustomTableType = {
  product: {
    image: string
    name: string
    manufacturer: string
  }
  category: string
  sku: string
  stock: number
  price: string
  orders: number
  rating: number
  reviews: number
  status: 'published' | 'pending' | 'out-of-stock'
  date: string
  time: string
}

export const customTableData: CustomTableType[] = [
  {
    product: {
      image: product1,
      name: 'Wireless Earbuds',
      manufacturer: 'My Furniture',
    },
    category: 'Electronics',
    sku: 'WB-10245',
    stock: 56,
    price: '$59.99',
    orders: 124,
    rating: 5,
    reviews: 87,
    status: 'published',
    date: '18 Apr, 2025',
    time: '12:24 PM',
  },
  {
    product: {
      image: product2,
      name: 'Smart LED Desk Lamp',
      manufacturer: 'BrightLite',
    },
    category: 'Home & Office',
    sku: 'SL-89012',
    stock: 32,
    price: '$899.0',
    orders: 78,
    rating: 4,
    reviews: 54,
    status: 'pending',
    date: '22 Apr, 2025',
    time: '09:45 AM',
  },
  {
    product: {
      image: product3,
      name: "Men's Running Shoes",
      manufacturer: 'ActiveWear Co.',
    },
    category: 'Fashion',
    sku: 'RS-20450',
    stock: 120,
    price: '$49.99',
    orders: 231,
    rating: 5,
    reviews: 142,
    status: 'published',
    date: '24 Apr, 2025',
    time: '03:10 PM',
  },
  {
    product: {
      image: product4,
      name: 'Fitness Tracker Watch',
      manufacturer: 'FitPulse',
    },
    category: 'Fitness',
    sku: 'FT-67123',
    stock: 78,
    price: '$120.00',
    orders: 198,
    rating: 4,
    reviews: 89,
    status: 'published',
    date: '23 Apr, 2025',
    time: '10:12 AM',
  },
  {
    product: {
      image: product5,
      name: 'Gaming Mouse RGB',
      manufacturer: 'HyperClick',
    },
    category: 'Gaming',
    sku: 'GM-72109',
    stock: 120,
    price: '$49.99',
    orders: 243,
    rating: 3,
    reviews: 102,
    status: 'published',
    date: '19 Apr, 2025',
    time: '05:56 PM',
  },
  {
    product: {
      image: product6,
      name: 'Modern Lounge Chair',
      manufacturer: 'UrbanLiving',
    },
    category: 'Furniture',
    sku: 'FC-31220',
    stock: 24,
    price: '$120.00',
    orders: 38,
    rating: 5,
    reviews: 27,
    status: 'out-of-stock',
    date: '18 Apr, 2025',
    time: '11:30 AM',
  },
  {
    product: {
      image: product7,
      name: 'Plush Toy Bear',
      manufacturer: 'Softies',
    },
    category: 'Toys',
    sku: 'TY-00788',
    stock: 150,
    price: '$1,299.00',
    orders: 305,
    rating: 4,
    reviews: 120,
    status: 'published',
    date: '17 Apr, 2025',
    time: '04:21 PM',
  },
  {
    product: {
      image: product8,
      name: '55" Ultra HD Smart TV',
      manufacturer: 'ViewMaster',
    },
    category: 'Electronics',
    sku: 'TV-5588',
    stock: 64,
    price: '$320.00',
    orders: 142,
    rating: 4,
    reviews: 88,
    status: 'published',
    date: '25 Apr, 2025',
    time: '10:10 AM',
  },
  {
    product: {
      image: product9,
      name: 'Apple iMac 24" M3',
      manufacturer: 'Apple',
    },
    category: 'Computers',
    sku: 'IMAC-M3-24',
    stock: 18,
    price: '$1,399.00',
    orders: 29,
    rating: 5,
    reviews: 16,
    status: 'pending',
    date: '24 Apr, 2025',
    time: '02:14 PM',
  },
  {
    product: {
      image: product10,
      name: 'Smart Watch Pro X2',
      manufacturer: 'FitTech',
    },
    category: 'Wearables',
    sku: 'SWPX2-GL',
    stock: 85,
    price: '$149.50',
    orders: 197,
    rating: 4,
    reviews: 65,
    status: 'published',
    date: '23 Apr, 2025',
    time: '08:00 AM',
  },
]
