import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverrequestComponent } from './driverrequest.component';

describe('DriverrequestComponent', () => {
  let component: DriverrequestComponent;
  let fixture: ComponentFixture<DriverrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
