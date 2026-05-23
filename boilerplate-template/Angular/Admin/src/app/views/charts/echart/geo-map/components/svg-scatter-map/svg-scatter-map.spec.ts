import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SvgScatterMap } from './svg-scatter-map'

describe('SvgScatterMap', () => {
  let component: SvgScatterMap
  let fixture: ComponentFixture<SvgScatterMap>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgScatterMap],
    }).compileComponents()

    fixture = TestBed.createComponent(SvgScatterMap)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
