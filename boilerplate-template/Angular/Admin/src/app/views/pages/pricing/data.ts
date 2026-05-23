export type PlanType = {
  name: string
  description: string
  price: number
  paymentType: string
  planInfo: string
  features: {
    included: boolean
    title: string
  }[]
  buttonText: string
  isPopular?: boolean
}

export const pricingPlanData: PlanType[] = [
  {
    name: 'Free Plan',
    description: 'Great for solo developers trying things out',
    price: 0,
    paymentType: 'No credit card required',
    planInfo: 'Free forever',
    features: [
      { included: true, title: '1 user license' },
      { included: true, title: 'Access to basic components' },
      { included: true, title: 'Community support only' },
      { included: true, title: 'Limited documentation' },
      { included: false, title: 'No commercial use' },
      { included: false, title: 'No Figma/design files' },
    ],
    buttonText: 'Start Free',
  },
  {
    name: 'Pro Plan',
    description: 'Ideal for freelancers and small teams with commercial needs',
    price: 129,
    paymentType: 'One-time payment',
    planInfo: 'Plus applicable taxes',
    features: [
      { included: true, title: '3 user licenses' },
      { included: true, title: 'Full component access' },
      { included: true, title: 'Commercial project rights' },
      { included: true, title: 'Email support' },
      { included: true, title: 'Lifetime updates' },
      { included: true, title: 'Figma design files' },
    ],
    buttonText: 'Upgrade Now',
    isPopular: true,
  },
  {
    name: 'Enterprise Plan',
    description: 'Best for companies with scaling teams and critical projects',
    price: 499,
    paymentType: 'One-time payment',
    planInfo: 'Includes extended support',
    features: [
      { included: true, title: 'Unlimited users' },
      { included: true, title: 'All premium components & layouts' },
      { included: true, title: 'Commercial & SaaS usage rights' },
      { included: true, title: 'Dedicated support & onboarding' },
      { included: true, title: 'Custom Figma UI kits' },
      { included: true, title: 'Priority feature requests' },
    ],
    buttonText: 'Contact Sales',
  },
]
