import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BasicActivity } from './basic-activity'

describe('BasicActivity', () => {
  let component: BasicActivity
  let fixture: ComponentFixture<BasicActivity>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicActivity],
    }).compileComponents()

    fixture = TestBed.createComponent(BasicActivity)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
