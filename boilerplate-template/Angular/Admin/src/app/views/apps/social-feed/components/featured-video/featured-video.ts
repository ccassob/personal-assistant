import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-featured-video',
  imports: [RouterLink, Icon, NgbDropdownModule],
  templateUrl: './featured-video.html',
  styles: ``,
})
export class FeaturedVideo {}
