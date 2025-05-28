import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRefundComponent } from './security-refund.component';

describe('SecurityRefundComponent', () => {
  let component: SecurityRefundComponent;
  let fixture: ComponentFixture<SecurityRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityRefundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
