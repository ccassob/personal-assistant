import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OutlookNav } from './outlook-nav'

describe('OutlookNav', () => {
  let component: OutlookNav
  let fixture: ComponentFixture<OutlookNav>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutlookNav],
    }).compileComponents()

    fixture = TestBed.createComponent(OutlookNav)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
