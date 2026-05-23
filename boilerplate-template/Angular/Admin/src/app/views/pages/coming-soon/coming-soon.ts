import { META_DATA } from '@/app/constants'
import { ChangeDetectorRef, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { interval, Subscription } from 'rxjs'

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink, Icon],
  templateUrl: './coming-soon.html',
  styles: ``,
})
export class ComingSoon {
  currentYear: number = new Date().getFullYear()
  name = META_DATA.name
  author = META_DATA.author
  constructor(private cdr: ChangeDetectorRef) {}

  _days?: number
  _hours?: number
  _minutes?: number
  _seconds?: number
  countdown: { days: number; hours: number; minutes: number; seconds: number } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
  private intervalSubscription!: Subscription

  private eventDate: Date = new Date('Sep 27, 2028 12:00:01')

  private calculateTimeToEvent() {
    const currentDate = new Date()
    const timeRemaining = this.eventDate.getTime() - currentDate.getTime()

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  ngOnInit(): void {
    this.countdown = this.calculateTimeToEvent()

    this.intervalSubscription = interval(1000).subscribe(() => {
      this.countdown = this.calculateTimeToEvent()
      this.cdr.detectChanges()
    })
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe()
  }
}
