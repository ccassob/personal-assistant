const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user10 = 'assets/images/users/user-10.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user5 = 'assets/images/users/user-5.jpg'

export type BlogType = {
  title: string
  description: string
  tags: string[]
  user: {
    name: string
    image: string
  }
  type?: string
}

export const blogData: BlogType[] = [
  {
    title: 'Mastering Figma: 7 Pro Tips for Better UI Design',
    description: 'Unlock advanced techniques in Figma that can speed up your workflow and help you create pixel-perfect designs every time.',
    tags: ['Figma', 'UX', 'Tips'],
    user: {
      name: 'Emma Blake',
      image: user6,
    },
  },
  {
    title: 'A well-known quote, contained in a blockquote element.',
    description: 'Someone famous in Source Title',
    tags: [],
    user: {
      name: 'Liam Carter',
      image: user7,
    },
    type: 'quote',
  },
  {
    title: 'Understanding CSS Grid: A Complete Beginner’s Guide',
    description: 'Explore the fundamentals of CSS Grid layout and learn how to create modern.',
    tags: ['CSS', 'Frontend', 'Web Design'],
    user: {
      name: 'Sophia Turner',
      image: user8,
    },
  },
  {
    title: 'The Future of AI in Everyday Apps',
    description: 'Artificial Intelligence is reshaping how we interact with software. From smart assistants to predictive analytics, here’s what’s coming next.',
    tags: ['AI', 'Technology', 'Innovation'],
    user: {
      name: 'Noah Evans',
      image: user9,
    },
  },
  {
    title: 'Top 10 JavaScript Tricks You Didn’t Know',
    description: 'JavaScript has plenty of hidden gems. This list goes beyond the basics, giving you shortcuts and lesser-known features to write cleaner code.',
    tags: ['JavaScript', 'Tips', 'Coding'],
    user: {
      name: 'Olivia Scott',
      image: user10,
    },
  },
  {
    title: 'Why Minimalism Works in Web Design',
    description: 'Sometimes, less is more. Discover how minimalistic design choices improve usability, reduce clutter, and create stronger focus for users across digital experiences.',
    tags: ['Design', 'Minimalism', 'Trends'],
    user: {
      name: 'Ethan Brooks',
      image: user3,
    },
  },
  {
    title: 'Getting Started with Tailwind CSS in 2025',
    description: 'Tailwind continues to dominate utility-first styling. Learn how to set up your environment and build your first responsive components quickly.',
    tags: ['Tailwind', 'Frontend', 'Guide'],
    user: {
      name: 'Mia Johnson',
      image: user2,
    },
  },
  {
    title: 'Dark Mode: Design Principles You Should Know',
    description: 'With dark mode becoming a standard feature, it’s important to understand contrast, accessibility, and design adjustments for user comfort.',
    tags: ['Dark Mode', 'UI', 'Accessibility'],
    user: {
      name: 'Lucas Reed',
      image: user5,
    },
  },
  {
    title: 'Why Storytelling Matters in UX Writing',
    description: 'Words shape user experiences. Good UX writing blends clarity with storytelling, ensuring users not only understand but enjoy every step.',
    tags: ['UX Writing', 'Content', 'Design'],
    user: {
      name: 'Isabella Moore',
      image: user9,
    },
  },
  {
    title: 'Building Scalable Apps with Next.js',
    description: 'Next.js has quickly become the go-to framework for modern apps. Here’s how you can take advantage of its server-side rendering and API routes to build scalable projects.',
    tags: ['Next.js', 'Performance', 'Development'],
    user: {
      name: 'James Bennett',
      image: user2,
    },
  },
]
