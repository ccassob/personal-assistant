import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserTimeline } from './user-timeline'

describe('UserTimeline', () => {
  let component: UserTimeline
  let fixture: ComponentFixture<UserTimeline>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTimeline],
    }).compileComponents()

    fixture = TestBed.createComponent(UserTimeline)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
