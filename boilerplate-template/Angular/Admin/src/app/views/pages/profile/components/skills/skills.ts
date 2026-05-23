import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { skillData } from '../../data'

@Component({
  selector: 'app-skills',
  imports: [RouterLink],
  templateUrl: './skills.html',
  styles: ``,
})
export class Skills {
  skillData = skillData
}
