import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MorphingMapBar } from './morphing-map-bar'

describe('MorphingMapBar', () => {
  let component: MorphingMapBar
  let fixture: ComponentFixture<MorphingMapBar>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorphingMapBar],
    }).compileComponents()

    fixture = TestBed.createComponent(MorphingMapBar)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
