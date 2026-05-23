import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LiveFavicon } from './live-favicon'

describe('LiveFavicon', () => {
  let component: LiveFavicon
  let fixture: ComponentFixture<LiveFavicon>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveFavicon],
    }).compileComponents()

    fixture = TestBed.createComponent(LiveFavicon)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
