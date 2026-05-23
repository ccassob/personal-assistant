import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Customization } from './customization'

describe('Customization', () => {
  let component: Customization
  let fixture: ComponentFixture<Customization>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Customization],
    }).compileComponents()

    fixture = TestBed.createComponent(Customization)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
