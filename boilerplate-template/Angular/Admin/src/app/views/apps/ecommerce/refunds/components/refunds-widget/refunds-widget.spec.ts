import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RefundsWidget } from './refunds-widget'

describe('RefundsWidget', () => {
  let component: RefundsWidget
  let fixture: ComponentFixture<RefundsWidget>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundsWidget],
    }).compileComponents()

    fixture = TestBed.createComponent(RefundsWidget)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
