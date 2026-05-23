import { Component, inject, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'

@Component({
  selector: 'app-validation',
  imports: [PageBreadcrumb, FormsModule, ReactiveFormsModule, Icon],
  templateUrl: './validation.html',
  styles: ``,
})
export class Validation implements OnInit {
  validationform!: UntypedFormGroup
  tooltipvalidationform!: UntypedFormGroup
  submit!: boolean
  formsubmit!: boolean

  public formBuilder = inject(UntypedFormBuilder)

  ngOnInit(): void {
    this.validationform = this.formBuilder.group({
      firstName: ['John', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      lastName: ['Doe', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      agree: ['', [Validators.required]],
    })

    /**
     * Bootstrap tooltip validation form data
     */
    this.tooltipvalidationform = this.formBuilder.group({
      firstName: ['Emily', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      lastName: ['Chen', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['Palo Alto', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      standfordId: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      department: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['94305', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      agree: ['', [Validators.required]],
    })
  }

  validSubmit() {
    this.submit = true
  }

  get form() {
    return this.validationform.controls
  }

  formSubmit() {
    this.formsubmit = true
  }

  get formData() {
    return this.tooltipvalidationform.controls
  }
}
