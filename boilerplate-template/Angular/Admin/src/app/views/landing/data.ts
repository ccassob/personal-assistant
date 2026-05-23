const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'

const client1 = 'assets/images/clients/01.svg'
const client2 = 'assets/images/clients/02.svg'
const client3 = 'assets/images/clients/03.svg'
const client4 = 'assets/images/clients/04.svg'
const client5 = 'assets/images/clients/05.svg'
const client6 = 'assets/images/clients/06.svg'
const client7 = 'assets/images/clients/07.svg'

const blog4 = 'assets/images/blog/blog-4.jpg'
const blog5 = 'assets/images/blog/blog-5.jpg'
const blog3 = 'assets/images/blog/blog-3.jpg'

export type UserType = {
  image: string
  name: string
}

export const userData: UserType[] = [
  {
    image: user7,
    name: 'Ava Lee',
  },
  {
    image: user8,
    name: 'Ethan King',
  },
  {
    image: user9,
    name: 'Lucas White',
  },
  {
    image: user1,
    name: 'Lucas White',
  },
  {
    image: user2,
    name: 'Lucas White',
  },
]

export type ServiceType = {
  icon: string
  title: string
  description: string
}

export const serviceData: ServiceType[] = [
  {
    icon: 'tabler:bulb',
    title: 'Digital Strategy',
    description: 'Crafting data-driven strategies to maximize online growth and brand engagement.',
  },
  {
    icon: 'tabler:chart-bar',
    title: 'SEO Optimization',
    description: 'Improve search engine rankings and increase website visibility through tailored SEO practices.',
  },
  {
    icon: 'tabler:speakerphone',
    title: 'Social Media Marketing',
    description: 'Engage your audience across platforms with strategic content and campaign management.',
  },
  {
    icon: 'tabler:world',
    title: 'Web Development',
    description: 'Building fast, responsive, and scalable websites that meet your business needs.',
  },
  {
    icon: 'tabler:mail',
    title: 'Email Marketing',
    description: 'Connect with your audience and boost conversions through targeted email campaigns.',
  },
  {
    icon: 'tabler:shopping-cart',
    title: 'E-Commerce Solutions',
    description: 'Launch and manage high-performing online stores with secure, scalable features.',
  },
  {
    icon: 'tabler:camera',
    title: 'Content Creation',
    description: 'Produce compelling visuals and copy to drive traffic and build brand identity.',
  },
  {
    icon: 'tabler:shield-check',
    title: 'Security Audits',
    description: 'Ensure your website and data are secure with comprehensive vulnerability assessments.',
  },
]

export type PricingPlanType = {
  name: string
  price: number
  description: string
  title: string
  features: {
    title: string
    included: boolean
  }[]
  btnClass: string
  isPopular?: boolean
}

export const pricingData: PricingPlanType[] = [
  {
    name: 'Single License',
    price: 49,
    description: 'Perfect for personal or one-client projects',
    title: 'Single project use',
    features: [
      { title: '1 project usage', included: true },
      { title: 'Full component access', included: true },
      { title: 'Basic documentation', included: true },
      { title: 'No multi-client use', included: false },
      { title: 'No SaaS/resale rights', included: false },
    ],
    btnClass: 'btn-outline-primary',
  },
  {
    name: 'Multiple License',
    price: 249,
    description: 'For developers or agencies working with multiple clients',
    title: 'Up to 5 projects',
    features: [
      { title: 'Use in up to 5 projects', included: true },
      { title: 'Commercial client use', included: true },
      { title: 'Lifetime updates', included: true },
      { title: 'Premium support', included: true },
      { title: 'No resale/SaaS rights', included: false },
    ],
    btnClass: 'btn-primary',
    isPopular: true,
  },
  {
    name: 'Extended License',
    price: 999,
    description: 'For SaaS products or items offered in paid applications',
    title: 'Commercial redistribution rights',
    features: [
      { title: 'Unlimited project usage', included: true },
      { title: 'SaaS & resale rights', included: true },
      { title: 'Full Figma source files', included: true },
      { title: 'Priority support', included: true },
      { title: 'Custom licensing agreement', included: true },
    ],
    btnClass: 'btn-dark',
  },
]

export type TestimonialType = {
  image: string
  name: string
  title: string
  description: string
  rating: number
}

export const testimonialData: TestimonialType[] = [
  {
    image: user1,
    name: 'Emily Carter',
    title: 'Absolutely love it!',
    description: `"This gadget exceeded all my expectations. Sleek design and incredible performance!"`,
    rating: 5,
  },
  {
    image: user2,
    name: 'Michael Zhang',
    title: 'Great value for money',
    description: `"Sturdy build and long battery life. Would definitely recommend it to friends!"`,
    rating: 5,
  },
  {
    image: user3,
    name: 'Sara Lopez',
    title: 'Top-notch customer service',
    description: `"The team helped me with my issue right away. Smooth experience overall!"`,
    rating: 5,
  },
  {
    image: user4,
    name: 'James Whitman',
    title: 'Highly impressed',
    description: `"The performance and features are unmatched in this price range. Highly impressed!"`,
    rating: 5,
  },
  {
    image: user5,
    name: 'Aisha Khan',
    title: 'Smooth experience from start to finish',
    description: `"The website, shipping, and support all worked flawlessly. Very satisfied!"`,
    rating: 5,
  },
]

export const clientData: string[] = [client1, client2, client3, client4, client5, client6, client7]

export type BlogType = {
  status: string
  image: string
  name: string
  title: string
  description: string
  date: string
  comments: number
  views: number
  author: {
    name: string
    image: string
  }
}

export const blogData: BlogType[] = [
  {
    status: 'Technology',
    image: blog4,
    name: 'Tech Innovations',
    title: 'The Future of Artificial Intelligence',
    description: 'Discover how AI is transforming industries and what the future holds for this cutting-edge technology.',
    date: 'Jan 12, 2025',
    comments: 89,
    views: 1284,
    author: {
      name: 'Michael Turner',
      image: user4,
    },
  },
  {
    status: 'Data Science',
    image: blog5,
    name: 'Data Science Trends',
    title: 'Top Data Science Trends in 2025',
    description: 'Get ahead in the data science field with the latest trends, technologies, and tools that are reshaping the industry.',
    date: 'Jan 12, 2025',
    comments: 89,
    views: 1284,
    author: {
      name: 'Olivia Brown',
      image: user1,
    },
  },
  {
    status: 'Business',
    image: blog3,
    name: 'Entrepreneur Tips',
    title: '5 Key Tips for New Entrepreneurs',
    description: 'Start your entrepreneurial journey with these 5 essential tips that will guide you through the first year of business.',
    date: 'Jan 12, 2025',
    comments: 89,
    views: 1284,
    author: {
      name: 'David Clark',
      image: user7,
    },
  },
]

export type SocialType = {
  title: string
  icon: string
}

export const socialData: SocialType[] = [
  {
    title: 'Facebook',
    icon: 'lucide:facebook',
  },
  {
    title: 'Twitter-x',
    icon: 'tabler:brand-x',
  },
  {
    title: 'Instagram',
    icon: 'lucide:instagram',
  },
  {
    title: 'WhatsApp',
    icon: 'lucide:dribbble',
  },
]

export type FooterType = {
  title: string
  link: {
    title: string
    href: string
    badge?: {
      title: string
      variant: string
    }
  }[]
}

export const footerData: FooterType[] = [
  {
    title: 'Company',
    link: [
      { title: 'Our Story', href: '' },
      { title: 'Leadership Team', href: '' },
      {
        title: 'Careers',
        href: '',
        badge: { title: "We're Hiring", variant: 'warning' },
      },
      { title: 'Press & Media', href: '' },
      { title: 'Investor Relations', href: '' },
      { title: 'Sustainability', href: '' },
    ],
  },
  {
    title: 'Community',
    link: [
      { title: 'Community Forum', href: '' },
      { title: 'Events & Meetups', href: '' },
      { title: 'Ambassadors', href: '' },
      { title: 'Customer Stories', href: '' },
      { title: 'Open Source', href: '' },
      { title: 'Code of Conduct', href: '' },
    ],
  },
  {
    title: 'Admin',
    link: [
      { title: 'Dashboard', href: '' },
      { title: 'User Management', href: '' },
      { title: 'Roles & Permissions', href: '' },
      { title: 'System Logs', href: '' },
      { title: 'Settings', href: '' },
      { title: 'API Access', href: '' },
    ],
  },
]
