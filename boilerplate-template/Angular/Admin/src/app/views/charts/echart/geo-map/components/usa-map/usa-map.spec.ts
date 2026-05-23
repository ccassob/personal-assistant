import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UsaMap } from './usa-map'

describe('UsaMap', () => {
  let component: UsaMap
  let fixture: ComponentFixture<UsaMap>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsaMap],
    }).compileComponents()

    fixture = TestBed.createComponent(UsaMap)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
