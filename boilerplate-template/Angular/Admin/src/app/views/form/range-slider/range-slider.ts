import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NouisliderModule } from 'ng2-nouislider'

@Component({
  selector: 'app-range-slider',
  imports: [PageBreadcrumb, NouisliderModule, FormsModule, Icon],
  templateUrl: './range-slider.html',
  styles: ``,
})
export class RangeSlider {
  range = 150
  sizeRange = 180
  sizeRange2 = 90
  lineRange1 = 50
  lineRange2 = 180
  lineRange3 = 90
  colorSliderRange1 = 240
  colorSliderRange2 = 185
  colorSliderRange3 = 90
  colorSliderRange4 = 125
  colorSliderRange5 = 155
  colorSliderRange6 = 70
  colorSliderRange7 = 180
  colorSliderRange8 = 77
  multiRange = [20, 80]
  linearRange = [500, 4000]
  tooltipSliderRange = [20, 75]
  softLimitsSlider = 50
  verticalSliderRange = [40, 60]
  verticalSliderRange2 = 40
  verticalSliderRange3 = 10

  softSliderConfig = {
    pips: {
      mode: 'values',
      values: [20, 80],
      density: 4,
    },
  }

  verticalSliderConfig = {
    start: [40, 60],
    connect: true,
    behaviour: 'drag',
    orientation: 'vertical',
    range: { min: 0, max: 100 },
  }

  val1 = 60
  val2 = 80
  locked = false
  private offset = this.val2 - this.val1
  private updating = false

  toggleLock(): void {
    this.locked = !this.locked
    if (this.locked) {
      this.offset = this.val2 - this.val1
    }
  }

  onChange1(newValue: number): void {
    const v = +newValue
    if (this.locked && !this.updating) {
      this.updating = true
      this.val1 = v
      this.val2 = this.validate(v + this.offset)
      this.updating = false
    } else {
      this.val1 = v
    }
  }

  onChange2(newValue: number): void {
    const v = +newValue
    if (this.locked && !this.updating) {
      this.updating = true
      this.val2 = v
      this.val1 = this.validate(v - this.offset)
      this.updating = false
    } else {
      this.val2 = v
    }
  }

  private validate(val: number): number {
    return Math.min(100, Math.max(0, val))
  }
}
