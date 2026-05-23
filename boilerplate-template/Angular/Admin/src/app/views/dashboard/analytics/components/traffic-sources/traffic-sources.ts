import { AsyncPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { interval, scan } from 'rxjs'
import { trafficData } from '../../data'

@Component({
  selector: 'app-traffic-sources',
  imports: [CardWithAction, NgbProgressbarModule, RouterLink, AsyncPipe],
  templateUrl: './traffic-sources.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrafficSources {
  trafficData = trafficData
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  public currentVisitors$ = interval(1000).pipe(
    scan(
      (acc) => {
        const change = this.getRandomNumber(-20, 20)
        return Math.max(100, acc + change)
      },
      this.getRandomNumber(500, 800)
    )
  )
}
