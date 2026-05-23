import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoadingButtons } from './loading-buttons'

describe('LoadingButtons', () => {
  let component: LoadingButtons
  let fixture: ComponentFixture<LoadingButtons>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingButtons],
    }).compileComponents()

    fixture = TestBed.createComponent(LoadingButtons)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
