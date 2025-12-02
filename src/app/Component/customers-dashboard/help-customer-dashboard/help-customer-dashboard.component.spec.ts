import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCustomerDashboardComponent } from './help-customer-dashboard.component';

describe('HelpCustomerDashboardComponent', () => {
  let component: HelpCustomerDashboardComponent;
  let fixture: ComponentFixture<HelpCustomerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCustomerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpCustomerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
