const manImg = 'assets/images/products/man.png'
const womenImg = 'assets/images/products/women.png'
const handbagImg = 'assets/images/products/hanbag.png'
const product1 = 'assets/images/products/1.png'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'
const product4 = 'assets/images/products/4.png'
const product5 = 'assets/images/products/5.png'
const product6 = 'assets/images/products/6.png'
const product7 = 'assets/images/products/7.png'
const product8 = 'assets/images/products/8.png'
const product9 = 'assets/images/products/9.png'

export type CategoryType = {
  title: string
  className: string
  links: { label: string; href: string }[]
  image: string
}

export const categoryData: CategoryType[] = [
  {
    title: 'For Men',
    className: 'bg-success',
    links: [
      { label: 'Sports suits', href: '' },
      { label: 'Trousers', href: '' },
      { label: 'Jackets and coats', href: '' },
      { label: 'Shirts', href: '' },
    ],
    image: manImg,
  },
  {
    title: 'For Women',
    className: 'bg-warning',
    links: [
      { label: 'Dresses', href: '' },
      { label: 'Pants and jeans', href: '' },
      { label: 'Shirts and blouses', href: '' },
      { label: 'Sweatshirts', href: '' },
    ],
    image: womenImg,
  },
  {
    title: 'Accessories',
    className: 'bg-danger',
    links: [
      { label: 'Caps and hats', href: '' },
      { label: 'Sunglasses', href: '' },
      { label: 'Handbags', href: '' },
      { label: 'Jewelry', href: '' },
    ],
    image: handbagImg,
  },
]

export type ProductType = {
  name: string
  image: string
  reviews: number
  rating: number
  discount: number
  price: number
}

export const productData: ProductType[] = [
  {
    name: 'Modern Minimalist Fabric Sofa Single Seater',
    image: product1,
    reviews: 45,
    rating: 3,
    discount: 15,
    price: 899,
  },
  {
    name: 'Funky Streetwear Sneakers - Neon Splash',
    image: product2,
    reviews: 32,
    rating: 3,
    discount: 25,
    price: 59,
  },
  {
    name: 'Noise Canceling Wireless Earbuds - Black Edition',
    image: product3,
    reviews: 58,
    rating: 3,
    discount: 15,
    price: 49,
  },
  {
    name: 'Minimalist Solid Wood Dining Chair',
    image: product4,
    reviews: 46,
    rating: 3,
    discount: 20,
    price: 120,
  },
  {
    name: 'Modern Black Minimalist Wall Clock',
    image: product5,
    reviews: 62,
    rating: 4,
    discount: 20,
    price: 49,
  },
  {
    name: 'Elegant Brown Wooden Chair',
    image: product6,
    reviews: 48,
    rating: 4,
    discount: 20,
    price: 120,
  },
  {
    name: 'Apple iMac 24" Retina 4.5K Display',
    image: product7,
    reviews: 65,
    rating: 4,
    discount: 20,
    price: 1299,
  },
  {
    name: 'Coolest Ergonomic Lounge Chair',
    image: product8,
    reviews: 52,
    rating: 4,
    discount: 20,
    price: 320,
  },
]
