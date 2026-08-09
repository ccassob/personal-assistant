import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { Echart } from './echart'

describe('Echart', () => {
  let component: Echart
  let fixture: ComponentFixture<Echart>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Echart],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Echart)
    component = fixture.componentInstance
    component.getOptions = () => ({})
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
