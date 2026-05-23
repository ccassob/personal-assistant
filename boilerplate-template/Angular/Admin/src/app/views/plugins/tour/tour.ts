import { Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { ShepherdService } from 'angular-shepherd'
import { featureData } from './data'

@Component({
  selector: 'app-tour',
  imports: [PageBreadcrumb, Icon, RouterLink],
  templateUrl: './tour.html',
  styles: ``,
})
export class Tour {
  featureData = featureData

  private shepherdService = inject(ShepherdService)

  startTour() {
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: {
        enabled: true,
      },
      classes: 'btn-primary',
      canClickTarget: false,
      modalOverlayOpeningPadding: 8,
      modalOverlayOpeningRadius: 4,
    }

    this.shepherdService.modal = true

    this.shepherdService.addSteps([
      {
        id: 'step-1',
        attachTo: {
          element: '#explorefeatureData',
          on: 'bottom',
        },
        title: '👋 Welcome to the Dashboard Tour',
        text: '<p class="mb-3">Take a quick tour to explore the key featureData of our admin dashboard.</p><p>Use your keyboard or click "Next" to continue.</p>',
        buttons: [
          {
            text: 'Next',
            action: () => this.shepherdService.tourObject?.next(),
          },
        ],
      },
      {
        id: 'step-2',
        attachTo: {
          element: '#gettingStarted',
          on: 'bottom',
        },
        title: 'Getting Started',
        text: 'Click here to get started and explore our framework-rich admin panel. 🚀',
        buttons: [
          {
            text: 'Back',
            action: () => this.shepherdService.tourObject?.back(),
          },
          {
            text: 'Next',
            action: () => this.shepherdService.tourObject?.next(),
          },
        ],
      },
      {
        id: 'step-3',
        attachTo: {
          element: '#buyNow',
          on: 'top',
        },
        title: 'Buy Now',
        text: 'Ready to supercharge your project? Click here to purchase the template!',
        buttons: [
          {
            text: 'Back',
            action: () => this.shepherdService.tourObject?.back(),
          },
          {
            text: 'Next',
            action: () => this.shepherdService.tourObject?.next(),
          },
        ],
      },
      {
        id: 'step-4',
        attachTo: {
          element: '#core-features',
          on: 'top',
        },
        title: 'Core features',
        text: 'Learn more about the versatile services and modules we provide to enhance development.',
        buttons: [
          {
            text: 'Back',
            action: () => this.shepherdService.tourObject?.back(),
          },
          {
            text: 'Next',
            action: () => this.shepherdService.tourObject?.next(),
          },
        ],
      },
      {
        id: 'step-5',
        attachTo: {
          element: '#thankyou-tour',
          on: 'top',
        },
        title: `Documentation`,
        text: `<p class="mb-3">Thanks for exploring! Read the documentation to get the most out of this template.</p>`,
        buttons: [
          {
            text: 'Back',
            action: () => this.shepherdService.tourObject?.back(),
          },
          {
            text: 'Next',
            action: () => this.shepherdService.tourObject?.next(),
          },
        ],
      },
      {
        id: 'step-6',
        attachTo: {
          element: '#explorefeatureData',
          on: 'top',
        },
        title: `You're All Set!`,
        text: `<p class="mb-3">You’re ready to make the most of your admin panel 🎉</p><p class="mb-3 text-muted">Click anywhere outside the tour to exit.</p>`,
        buttons: [
          {
            text: 'Back',
            action: () => this.shepherdService.tourObject?.back(),
          },
          {
            text: 'Finish',
            action: () => this.shepherdService.tourObject?.complete(),
          },
        ],
      },
    ])
    this.shepherdService.start()
  }
}
