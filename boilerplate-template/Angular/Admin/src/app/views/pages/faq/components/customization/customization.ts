import { Component } from '@angular/core'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

type FaqType = {
  question: string
  answer: string
}
@Component({
  selector: 'app-customization',
  imports: [NgbAccordionModule],
  templateUrl: './customization.html',
  styles: ``,
})
export class Customization {
  customizationFaqData: FaqType[] = [
    {
      question: 'Do you offer customization services?',
      answer: 'Yes, we offer paid customization services based on your requirements. Contact us for a quote.',
    },
    {
      question: 'Can I modify the template myself?',
      answer: 'Absolutely! All templates come with full source code and documentation to help you make your own changes.',
    },
    {
      question: 'Will customizing the template affect support?',
      answer: 'Support is still available, but major custom changes may not be covered under standard support terms.',
    },
  ]
}
