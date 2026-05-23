import { Icon } from '@/app/components/icon/icon'
import { PageBreadcrumb } from '@/app/components/page-breadcrumb/page-breadcrumb'
import { Component } from '@angular/core'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'

type Alert = {
  id: number
  message: string
  type: string
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [Icon, NgbAlertModule, PageBreadcrumb],
  templateUrl: './alerts.html',
  styles: ``,
})
export class Alerts {
  alertCounter = 0

  showAlerts = {
    primary: true,
    secondary: true,
    dark: true,
    purple: true,
    danger: true,
    warning: true,
    info: true,
    light: true,
  }

  alerts: Alert[] = []

  alertData: Alert[] = [
    {
      id: 1,
      type: 'primary',
      message: 'Heads up! This is a primary alert with important information.',
    },
    {
      id: 2,
      type: 'secondary',
      message: 'Notice: This is a secondary alert with supporting details.',
    },
    { id: 3, type: 'success', message: 'Success! Your action was completed successfully.' },
    { id: 4, type: 'danger', message: 'Error! Something went wrong—please try again later.' },
    { id: 5, type: 'warning', message: 'Warning! Please review your input before proceeding.' },
    { id: 6, type: 'info', message: 'Info: Here’s something you might find helpful.' },
    { id: 7, type: 'light', message: 'Note: This is a light alert with a subtle message.' },
    { id: 8, type: 'dark', message: 'Notice: This dark alert is great for general messages.' },
    {
      id: 9,
      type: 'purple',
      message: 'Heads up: This purple alert is perfect for catching attention with general information.',
    },
  ]

  alertData2: Alert[] = [
    {
      id: 1,
      type: 'primary',
      message: 'This is a primary alert—something important you should know!',
    },
    { id: 2, type: 'secondary', message: 'This is a secondary alert—some additional context.' },
    { id: 3, type: 'success', message: 'Success! Your operation was completed successfully.' },
    { id: 4, type: 'danger', message: 'Error! Something went wrong—please try again.' },
    { id: 5, type: 'warning', message: 'Warning! Please double-check your inputs.' },
    { id: 6, type: 'info', message: "Info: Here's something you might find useful." },
    { id: 7, type: 'light', message: 'Light alert—just a subtle notification.' },
    { id: 8, type: 'dark', message: 'Dark alert—use for general-purpose messages.' },
    {
      id: 9,
      type: 'purple',
      message: 'Purple alert—use for general-purpose messages.',
    },
  ]

  linkAlert = [
    {
      variant: 'primary',
      content: `Need more info? Check out <a [routerLink]="[]" class="alert-link">this primary link</a> for important details.`,
    },
    {
      variant: 'secondary',
      content: `Here's a secondary message with <a [routerLink]="[]" class="alert-link">a helpful link</a> for additional context.`,
    },
    {
      variant: 'success',
      content: `Operation successful! View the results <a [routerLink]="[]" class="alert-link">by clicking here</a>.`,
    },
    {
      variant: 'danger',
      content: `Something went wrong. Learn more <a [routerLink]="[]" class="alert-link">through this alert link</a>.`,
    },
    {
      variant: 'warning',
      content: ` Heads up! You might want to check <a [routerLink]="[]" class="alert-link">this warning link</a>.`,
    },
    {
      variant: 'info',
      content: `Here’s some information that may help—click <a [routerLink]="[]" class="alert-link">this link</a> to read more.`,
    },
    {
      variant: 'light',
      content: `Just a light reminder with <a [routerLink]="[]" class="alert-link">a gentle link</a> to explore.`,
    },
    {
      variant: 'dark',
      content: `This is a general dark alert. Find out more <a [routerLink]="[]" class="alert-link">by clicking here</a>.`,
    },
    {
      variant: 'purple',
      content: `Important notice: For more information, <a [routerLink]="[]" class="alert-link">click here</a>.`,
    },
  ]

  triggerAlert(): void {
    const newAlert: Alert = {
      id: this.alertCounter,
      message: `Nice, you triggered this alert message!`,
      type: 'success',
    }
    this.alerts.push(newAlert)
    this.alertCounter++
  }

  removeAlert(id: number): void {
    this.alerts = this.alerts.filter((alert) => alert.id !== id)
  }
  closeAlert(id: number) {
    this.alertData = this.alertData.filter((alert) => alert.id !== id)
  }
}
