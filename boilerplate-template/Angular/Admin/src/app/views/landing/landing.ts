import { Component } from '@angular/core'
import { Blogs } from './components/blogs/blogs'
import { Contact } from './components/contact/contact'
import { Cta } from './components/cta/cta'
import { Features } from './components/features/features'
import { Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { Hero } from './components/hero/hero'
import { PricingPlans } from './components/pricing-plans/pricing-plans'
import { Services } from './components/services/services'
import { Testimonial } from './components/testimonial/testimonial'

@Component({
  selector: 'app-landing',
  imports: [Header, Hero, Services, Features, PricingPlans, Cta, Testimonial, Blogs, Contact, Footer],
  templateUrl: './landing.html',
  styles: ``,
})
export class Landing {}
