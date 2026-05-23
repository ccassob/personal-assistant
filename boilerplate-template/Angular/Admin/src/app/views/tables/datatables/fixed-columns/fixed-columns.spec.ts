import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FixedColumns } from './fixed-columns'

describe('FixedColumns', () => {
  let component: FixedColumns
  let fixture: ComponentFixture<FixedColumns>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedColumns],
    }).compileComponents()

    fixture = TestBed.createComponent(FixedColumns)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
