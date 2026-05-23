import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CheckboxSelect } from './checkbox-select'

describe('CheckboxSelect', () => {
  let component: CheckboxSelect
  let fixture: ComponentFixture<CheckboxSelect>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxSelect],
    }).compileComponents()

    fixture = TestBed.createComponent(CheckboxSelect)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
