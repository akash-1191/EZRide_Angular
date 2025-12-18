import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPaymentDetailsComponent } from './driver-payment-details.component';

describe('DriverPaymentDetailsComponent', () => {
  let component: DriverPaymentDetailsComponent;
  let fixture: ComponentFixture<DriverPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverPaymentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
