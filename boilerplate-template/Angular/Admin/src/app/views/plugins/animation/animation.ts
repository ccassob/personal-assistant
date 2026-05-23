import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

type AnimationType = {
  name: string
  animations: string[]
}

@Component({
  selector: 'app-animation',
  imports: [PageBreadcrumb, NgbAccordionModule],
  templateUrl: './animation.html',
  styles: ``,
})
export class Animation {
  animationData: AnimationType[] = [
    {
      name: 'Attention Seekers',
      animations: ['bounce', 'flash', 'pulse', 'rubberBand', 'shakeX', 'shakeY', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat'],
    },
    {
      name: 'Bouncing Entrances',
      animations: ['bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp'],
    },
    {
      name: 'Fading Entrances',
      animations: ['fadeIn', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInUp'],
    },
    {
      name: 'Fading Exits',
      animations: ['fadeOut', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight', 'fadeOutUp'],
    },
    {
      name: 'Flippers',
      animations: ['flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY'],
    },
    {
      name: 'Light Speed',
      animations: ['lightSpeedInLeft', 'lightSpeedInRight', 'lightSpeedOutLeft', 'lightSpeedOutRight'],
    },
    {
      name: 'Rotate',
      animations: ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'],
    },
    {
      name: 'Zoom',
      animations: ['zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp'],
    },
    {
      name: 'Sliding',
      animations: ['slideInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp'],
    },
    {
      name: 'Special',
      animations: ['hinge', 'jackInTheBox', 'rollIn', 'rollOut'],
    },
  ]

  applyAnimation(animation: string): void {
    const el = document.getElementById('animation_box')
    if (el) {
      el.classList.remove(...Array.from(el.classList).filter((c) => c.startsWith('animate__')))
      void el.offsetWidth
      el.classList.add('animate__animated', `animate__${animation}`)
    }
  }
}
