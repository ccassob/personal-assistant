import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Discussions } from './discussions'

describe('Discussions', () => {
  let component: Discussions
  let fixture: ComponentFixture<Discussions>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discussions],
    }).compileComponents()

    fixture = TestBed.createComponent(Discussions)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
