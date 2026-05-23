import { formatBytes } from '@/app/utils/string'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { FolderType } from '../../data'

@Component({
  selector: 'app-folder-card',
  imports: [NgbDropdownModule, RouterLink, Icon],
  templateUrl: './folder-card.html',
  styles: ``,
})
export class FolderCard {
  @Input() item!: FolderType
  protected readonly formatBytes = formatBytes
}
