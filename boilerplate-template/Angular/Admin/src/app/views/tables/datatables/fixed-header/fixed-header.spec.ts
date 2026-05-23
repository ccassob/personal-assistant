import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FixedHeader } from './fixed-header'

describe('FixedHeader', () => {
  let component: FixedHeader
  let fixture: ComponentFixture<FixedHeader>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedHeader],
    }).compileComponents()

    fixture = TestBed.createComponent(FixedHeader)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
