import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAvalibleComponent } from './vehicle-avalible.component';

describe('VehicleAvalibleComponent', () => {
  let component: VehicleAvalibleComponent;
  let fixture: ComponentFixture<VehicleAvalibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAvalibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAvalibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
