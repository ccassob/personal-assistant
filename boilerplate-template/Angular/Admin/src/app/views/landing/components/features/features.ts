import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CountUpDirective } from 'ngx-countup'

@Component({
  selector: 'app-features',
  imports: [CountUpDirective, RouterLink],
  templateUrl: './features.html',
  styles: ``,
})
export class Features {}
