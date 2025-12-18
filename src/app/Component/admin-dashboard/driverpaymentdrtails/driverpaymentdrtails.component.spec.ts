import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverpaymentdrtailsComponent } from './driverpaymentdrtails.component';

describe('DriverpaymentdrtailsComponent', () => {
  let component: DriverpaymentdrtailsComponent;
  let fixture: ComponentFixture<DriverpaymentdrtailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverpaymentdrtailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverpaymentdrtailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
