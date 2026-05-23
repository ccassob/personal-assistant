import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutService } from '@core/services/layout.service'
import { VerticalLayout } from '@layouts/vertical-layout'

@Component({
  selector: 'app-main-layout',
  imports: [VerticalLayout, RouterOutlet],
  template: `<app-vertical-layout><router-outlet /></app-vertical-layout>`,
})
export class MainLayout {
  constructor(public layout: LayoutService) {}
}
