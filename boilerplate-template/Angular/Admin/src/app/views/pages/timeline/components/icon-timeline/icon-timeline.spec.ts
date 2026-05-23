import { ComponentFixture, TestBed } from '@angular/core/testing'
import { IconTimeline } from './icon-timeline'

describe('IconTimeline', () => {
  let component: IconTimeline
  let fixture: ComponentFixture<IconTimeline>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTimeline],
    }).compileComponents()

    fixture = TestBed.createComponent(IconTimeline)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
