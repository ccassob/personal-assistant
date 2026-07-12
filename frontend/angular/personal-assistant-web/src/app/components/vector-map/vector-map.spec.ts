import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VectorMap } from './vector-map'

describe('VectorMap', () => {
  let component: VectorMap
  let fixture: ComponentFixture<VectorMap>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VectorMap],
    }).compileComponents()

    fixture = TestBed.createComponent(VectorMap)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
