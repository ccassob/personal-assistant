import { Component } from '@angular/core'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

type FaqType = {
  question: string
  answer: string
}
@Component({
  selector: 'app-payments',
  imports: [NgbAccordionModule],
  templateUrl: './payments.html',
  styles: ``,
})
export class Payments {
  paymentFaqData: FaqType[] = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, PayPal, and Stripe payments. Some marketplaces may support additional methods.',
    },
    {
      question: 'Will I receive an invoice after purchase?',
      answer: 'Yes, you will receive an official invoice or receipt via email immediately after your purchase is completed.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we follow the refund policy of the marketplace where the item was purchased. Please refer to their refund terms or contact us directly if unsure.',
    },
    {
      question: 'Can I upgrade my license later?',
      answer: 'Absolutely! You can upgrade your license at any time by contacting support or purchasing the extended license separately.',
    },
    {
      question: 'Why was my payment declined?',
      answer: 'Payment failures may occur due to incorrect card info, insufficient funds, or bank restrictions. Please try another method or contact your provider.',
    },
  ]
}
