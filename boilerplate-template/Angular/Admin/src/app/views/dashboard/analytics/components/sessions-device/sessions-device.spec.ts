import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SessionsDevice } from './sessions-device'

describe('SessionsDevice', () => {
  let component: SessionsDevice
  let fixture: ComponentFixture<SessionsDevice>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsDevice],
    }).compileComponents()

    fixture = TestBed.createComponent(SessionsDevice)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
