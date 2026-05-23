import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OtherPlugin } from './other-plugin'

describe('OtherPlugin', () => {
  let component: OtherPlugin
  let fixture: ComponentFixture<OtherPlugin>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPlugin],
    }).compileComponents()

    fixture = TestBed.createComponent(OtherPlugin)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
