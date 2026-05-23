import { formatBytes } from '@/app/utils/string'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { fileItemData } from '../../data'

@Component({
  selector: 'app-file-manage-card',
  imports: [RouterLink],
  templateUrl: './file-manage-card.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FileManageCard {
  fileItemData = fileItemData
  protected readonly formatBytes = formatBytes
}
