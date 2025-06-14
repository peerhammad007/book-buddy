import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackBorrowsComponent } from './track-borrows.component';

describe('TrackBorrowsComponent', () => {
  let component: TrackBorrowsComponent;
  let fixture: ComponentFixture<TrackBorrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackBorrowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackBorrowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
