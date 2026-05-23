import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VerticalWizard } from './vertical-wizard'

describe('VerticalWizard', () => {
  let component: VerticalWizard
  let fixture: ComponentFixture<VerticalWizard>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalWizard],
    }).compileComponents()

    fixture = TestBed.createComponent(VerticalWizard)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
