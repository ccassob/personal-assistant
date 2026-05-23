import { ApexOptions } from 'ng-apexcharts'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'
const product4 = 'assets/images/products/4.png'
const product5 = 'assets/images/products/5.png'
const product6 = 'assets/images/products/6.png'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user8 = 'assets/images/users/user-8.jpg'

export type ProductReviewType = {
  product: {
    name: string
    image: string
  }
  user: {
    name: string
    image: string
    email: string
  }
  rating: number
  message: string
  description: string
  date: string
  time: string
  status: 'published' | 'pending'
}

export const productReviewData: ProductReviewType[] = [
  {
    product: {
      name: 'Wireless Earbuds',
      image: product2,
    },
    user: {
      name: 'Sophia Lee',
      image: user8,
      email: 'sophia.lee@digitalshop.com',
    },
    rating: 5,
    message: 'Great product, would buy again!',
    description: 'These earbuds are amazing, the sound quality is top-notch. Totally worth the price!',
    date: '22 Apr, 2025',
    time: '04:10 PM',
    status: 'published',
  },
  {
    product: {
      name: 'Smart Watch',
      image: product3,
    },
    user: {
      name: 'David Smith',
      image: user6,
      email: 'david.smith@healthstore.com',
    },
    rating: 4,
    message: 'Decent, but overpriced',
    description: "It does the job, but I feel like it's a little expensive for what it offers.",
    date: '23 Apr, 2025',
    time: '02:20 PM',
    status: 'pending',
  },
  {
    product: {
      name: '4K Ultra HD TV',
      image: product4,
    },
    user: {
      name: 'Alice Johnson',
      image: user3,
      email: 'alice.johnson@homesupplies.com',
    },
    rating: 5,
    message: 'Amazing quality!',
    description: 'The TV has incredible picture quality. Totally worth the investment!',
    date: '24 Apr, 2025',
    time: '09:15 AM',
    status: 'published',
  },
  {
    product: {
      name: 'Smartphone X',
      image: product5,
    },
    user: {
      name: 'Michael Green',
      image: user2,
      email: 'michael.green@mobileshop.com',
    },
    rating: 5,
    message: 'Perfect phone, highly recommended!',
    description: 'The camera is amazing and the performance is smooth. Definitely the best smartphone I have used!',
    date: '25 Apr, 2025',
    time: '11:30 AM',
    status: 'published',
  },
  {
    product: {
      name: 'Gaming Laptop',
      image: product6,
    },
    user: {
      name: 'Chris Evans',
      image: user4,
      email: 'chris.evans@gamestore.com',
    },
    rating: 4,
    message: 'Great for gaming but heavy',
    description: "The performance is amazing, but it's a bit too heavy to carry around all day.",
    date: '26 Apr, 2025',
    time: '10:00 AM',
    status: 'pending',
  },
]

export type RatingType = {
  label: string
  value: number
  count: number
}

export const ratingData: RatingType[] = [
  { label: '5 Star', value: 85, count: 128 },
  { label: '4 Star', value: 10, count: 37 },
  { label: '3 Star', value: 3, count: 15 },
  { label: '2 Star', value: 1, count: 7 },
  { label: '1 Star', value: 1, count: 2 },
]

export const getReviewChartOptions: () => ApexOptions = () => ({
  chart: {
    type: 'area',
    height: 185,
    toolbar: { show: false },
  },
  grid: {
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  series: [
    {
      name: 'Reviews',
      data: [5, 8, 6, 7, 10, 12, 9, 14, 11, 15, 17, 19, 14, 13, 16, 18, 22, 20, 19, 17, 15, 18, 20, 23, 21, 22, 24, 26, 25, 28],
    },
  ],
  xaxis: {
    categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    labels: {
      rotate: -45,
      style: {
        fontSize: '10px',
      },
    },
  },
  colors: ['#1ab394'],
  fill: {
    opacity: 0.3,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return `${val} Reviews`
      },
    },
  },
})
