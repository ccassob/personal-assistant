import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TopCountries } from './top-countries'

describe('TopCountries', () => {
  let component: TopCountries
  let fixture: ComponentFixture<TopCountries>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCountries],
    }).compileComponents()

    fixture = TestBed.createComponent(TopCountries)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
