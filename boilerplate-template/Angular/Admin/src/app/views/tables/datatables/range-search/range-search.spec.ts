import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RangeSearch } from './range-search'

describe('RangeSearch', () => {
  let component: RangeSearch
  let fixture: ComponentFixture<RangeSearch>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSearch],
    }).compileComponents()

    fixture = TestBed.createComponent(RangeSearch)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
