import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { SimplebarAngularModule } from 'simplebar-angular'
import { categoryData, sidebarMenuItemData } from '../../data'

@Component({
  selector: 'app-file-sidebar',
  imports: [SimplebarAngularModule, RouterLink, Icon, CommonModule],
  templateUrl: './file-sidebar.html',
  styles: ``,
})
export class FileSidebar {
  sidebarMenuItemData = sidebarMenuItemData
  categoryData = categoryData
}
