import { ComponentFixture, TestBed } from '@angular/core/testing'
import { VoteList } from './vote-list'

describe('VoteList', () => {
  let component: VoteList
  let fixture: ComponentFixture<VoteList>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteList],
    }).compileComponents()

    fixture = TestBed.createComponent(VoteList)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
