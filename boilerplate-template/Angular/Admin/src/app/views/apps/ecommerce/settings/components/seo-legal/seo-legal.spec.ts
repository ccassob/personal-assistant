import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SeoLegal } from './seo-legal'

describe('SeoLegal', () => {
  let component: SeoLegal
  let fixture: ComponentFixture<SeoLegal>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeoLegal],
    }).compileComponents()

    fixture = TestBed.createComponent(SeoLegal)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
