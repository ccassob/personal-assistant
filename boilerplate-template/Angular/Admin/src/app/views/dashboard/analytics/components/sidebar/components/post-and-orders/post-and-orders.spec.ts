import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PostAndOrders } from './post-and-orders'

describe('PostAndOrders', () => {
  let component: PostAndOrders
  let fixture: ComponentFixture<PostAndOrders>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAndOrders],
    }).compileComponents()

    fixture = TestBed.createComponent(PostAndOrders)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
