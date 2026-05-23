const product1 = 'assets/images/products/1.png'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'
const product4 = 'assets/images/products/4.png'
const product5 = 'assets/images/products/5.png'
const product6 = 'assets/images/products/6.png'
const product7 = 'assets/images/products/7.png'
const product8 = 'assets/images/products/8.png'

export type ProductType = {
  name: string
  image: string
  price: number
  discount?: number
  rating: number
  reviews: number
}

export const productData: ProductType[] = [
  {
    name: 'Modern Minimalist Fabric Sofa Single Seater',
    image: product1,
    price: 899.0,
    discount: 15,
    rating: 3,
    reviews: 45,
  },
  {
    name: 'Funky Streetwear Sneakers - Neon Splash',
    image: product2,
    price: 59.99,
    discount: 25,
    rating: 3,
    reviews: 32,
  },
  {
    name: 'Noise Canceling Wireless Earbuds - Black Edition',
    image: product3,
    price: 49.99,
    discount: 15,
    rating: 3,
    reviews: 58,
  },
  {
    name: 'Minimalist Solid Wood Dining Chair',
    image: product4,
    price: 120.0,
    discount: 20,
    rating: 3,
    reviews: 46,
  },
  {
    name: 'Modern Black Minimalist Wall Clock',
    image: product5,
    price: 49.99,
    discount: 20,
    rating: 4,
    reviews: 62,
  },
  {
    name: 'Elegant Brown Wooden Chair',
    image: product6,
    price: 120.0,
    discount: 20,
    rating: 4,
    reviews: 48,
  },
  {
    name: 'Apple iMac 24" Retina 4.5K Display',
    image: product7,
    price: 1299.0,
    discount: 20,
    rating: 4,
    reviews: 65,
  },
  {
    name: 'Coolest Ergonomic Lounge Chair',
    image: product8,
    price: 320.0,
    discount: 20,
    rating: 4,
    reviews: 52,
  },
]
