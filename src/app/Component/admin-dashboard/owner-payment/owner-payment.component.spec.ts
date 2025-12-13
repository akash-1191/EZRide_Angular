import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPaymentComponent } from './owner-payment.component';

describe('OwnerPaymentComponent', () => {
  let component: OwnerPaymentComponent;
  let fixture: ComponentFixture<OwnerPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
