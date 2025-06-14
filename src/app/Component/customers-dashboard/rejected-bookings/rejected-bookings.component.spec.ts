import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBookingsComponent } from './rejected-bookings.component';

describe('RejectedBookingsComponent', () => {
  let component: RejectedBookingsComponent;
  let fixture: ComponentFixture<RejectedBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
