import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'

import { Apexchart } from './apexchart'

describe('Apexchart', () => {
  let component: Apexchart
  let fixture: ComponentFixture<Apexchart>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apexchart],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Apexchart)
    component = fixture.componentInstance
    component.getOptions = () => ({})
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
