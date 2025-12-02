import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAddvehicleComponent } from './own-addvehicle.component';

describe('OwnAddvehicleComponent', () => {
  let component: OwnAddvehicleComponent;
  let fixture: ComponentFixture<OwnAddvehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnAddvehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnAddvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
