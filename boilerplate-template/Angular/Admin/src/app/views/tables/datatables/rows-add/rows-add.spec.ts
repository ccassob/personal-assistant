import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RowsAdd } from './rows-add'

describe('RowsAdd', () => {
  let component: RowsAdd
  let fixture: ComponentFixture<RowsAdd>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowsAdd],
    }).compileComponents()

    fixture = TestBed.createComponent(RowsAdd)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
