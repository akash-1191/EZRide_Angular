import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDamageReportComponent } from './fuel-damage-report.component';

describe('FuelDamageReportComponent', () => {
  let component: FuelDamageReportComponent;
  let fixture: ComponentFixture<FuelDamageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelDamageReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelDamageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
