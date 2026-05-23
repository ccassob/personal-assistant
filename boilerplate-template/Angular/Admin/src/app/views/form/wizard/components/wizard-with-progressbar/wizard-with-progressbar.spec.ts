import { ComponentFixture, TestBed } from '@angular/core/testing'
import { WizardWithProgressbar } from './wizard-with-progressbar'

describe('WizardWithProgressbar', () => {
  let component: WizardWithProgressbar
  let fixture: ComponentFixture<WizardWithProgressbar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardWithProgressbar],
    }).compileComponents()

    fixture = TestBed.createComponent(WizardWithProgressbar)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
