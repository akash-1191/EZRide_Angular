import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AAddvehicleComponent } from './a-addvehicle.component';

describe('AAddvehicleComponent', () => {
  let component: AAddvehicleComponent;
  let fixture: ComponentFixture<AAddvehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AAddvehicleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AAddvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
