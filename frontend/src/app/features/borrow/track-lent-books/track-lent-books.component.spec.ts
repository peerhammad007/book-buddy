import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLentBooksComponent } from './track-lent-books.component';

describe('TrackLentBooksComponent', () => {
  let component: TrackLentBooksComponent;
  let fixture: ComponentFixture<TrackLentBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackLentBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackLentBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
