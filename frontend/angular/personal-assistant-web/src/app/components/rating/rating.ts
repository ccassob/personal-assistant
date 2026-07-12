import { Component, Input, TemplateRef } from '@angular/core'
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap'
import { Icon } from '../icon/icon'

@Component({
  selector: 'app-rating',
  imports: [NgbRating, Icon],
  providers: [NgbRatingConfig],
  templateUrl: './rating.html',
  styles: ``,
})
export class Rating {
  @Input() rate!: number
  @Input() max: number = 5
  @Input() readonly: boolean = true
  @Input() resettable: boolean = false
  @Input() starTemplate?: TemplateRef<any>
  @Input() disabled: boolean = false
  @Input() tabindex: number = 0
}
