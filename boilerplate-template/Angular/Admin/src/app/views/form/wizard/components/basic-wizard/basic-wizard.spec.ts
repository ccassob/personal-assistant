import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BasicWizard } from './basic-wizard'

describe('BasicWizard', () => {
  let component: BasicWizard
  let fixture: ComponentFixture<BasicWizard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicWizard],
    }).compileComponents()

    fixture = TestBed.createComponent(BasicWizard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
