import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ApiWidget } from './api-widget'

describe('ApiWidget', () => {
  let component: ApiWidget
  let fixture: ComponentFixture<ApiWidget>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiWidget],
    }).compileComponents()

    fixture = TestBed.createComponent(ApiWidget)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
