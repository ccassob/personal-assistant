import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ExpandedActivity } from './expanded-activity'

describe('ExpandedActivity', () => {
  let component: ExpandedActivity
  let fixture: ComponentFixture<ExpandedActivity>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandedActivity],
    }).compileComponents()

    fixture = TestBed.createComponent(ExpandedActivity)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
