import { Component } from '@angular/core'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

type FaqType = {
  question: string
  answer: string
}
@Component({
  selector: 'app-refunds',
  imports: [NgbAccordionModule],
  templateUrl: './refunds.html',
  styles: ``,
})
export class Refunds {
  refundFaqData: FaqType[] = [
    {
      question: 'What is your refund policy?',
      answer: 'We offer refunds within 14 days of purchase if the template is faulty or not as described. Please review the full policy or reach out for clarification.',
    },
    {
      question: 'How do I request a refund?',
      answer: 'You can request a refund by contacting our support team with your order ID and a brief reason for the request.',
    },
    {
      question: 'Are there any non-refundable purchases?',
      answer: 'Custom services, extended licenses, and downloadable assets with confirmed usage typically aren’t refundable.',
    },
  ]
}
