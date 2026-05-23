import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Elements } from './elements'

describe('Elements', () => {
  let component: Elements
  let fixture: ComponentFixture<Elements>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elements],
    }).compileComponents()

    fixture = TestBed.createComponent(Elements)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
