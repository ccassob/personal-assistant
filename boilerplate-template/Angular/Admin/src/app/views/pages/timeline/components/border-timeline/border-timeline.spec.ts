import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BorderTimeline } from './border-timeline'

describe('BorderTimeline', () => {
  let component: BorderTimeline
  let fixture: ComponentFixture<BorderTimeline>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorderTimeline],
    }).compileComponents()

    fixture = TestBed.createComponent(BorderTimeline)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
