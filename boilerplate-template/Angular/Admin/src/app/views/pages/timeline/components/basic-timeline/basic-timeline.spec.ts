import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BasicTimeline } from './basic-timeline'

describe('BasicTimeline', () => {
  let component: BasicTimeline
  let fixture: ComponentFixture<BasicTimeline>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicTimeline],
    }).compileComponents()

    fixture = TestBed.createComponent(BasicTimeline)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
