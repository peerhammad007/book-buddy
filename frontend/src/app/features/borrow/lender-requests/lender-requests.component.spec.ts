import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LenderRequestsComponent } from './lender-requests.component';

describe('LenderRequestsComponent', () => {
  let component: LenderRequestsComponent;
  let fixture: ComponentFixture<LenderRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LenderRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LenderRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
