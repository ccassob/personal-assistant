import { Component } from '@angular/core'
import { SimplebarAngularModule } from 'simplebar-angular'
import { PostAndOrders } from '../post-and-orders/post-and-orders'
import { QuickMessage } from '../quick-message/quick-message'
import { TodaySchedule } from '../today-schedule/today-schedule'

@Component({
  selector: 'app-sidebar-content',
  imports: [QuickMessage, PostAndOrders, TodaySchedule, SimplebarAngularModule],
  templateUrl: './sidebar-content.html',
  styles: ``,
})
export class SidebarContent {}
