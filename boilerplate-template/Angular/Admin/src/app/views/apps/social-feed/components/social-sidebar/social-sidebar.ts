import { META_DATA } from '@/app/constants'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { categoryData, profileMainMenuData } from '../../data'

@Component({
  selector: 'app-social-sidebar',
  imports: [Icon, CommonModule, RouterLink, NgbDropdownModule],
  templateUrl: './social-sidebar.html',
  styles: ``,
})
export class SocialSidebar {
  username = META_DATA.username

  profileMainMenuData = profileMainMenuData
  categoryData = categoryData
}
