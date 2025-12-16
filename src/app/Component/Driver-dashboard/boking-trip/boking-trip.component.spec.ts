import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BokingTripComponent } from './boking-trip.component';

describe('BokingTripComponent', () => {
  let component: BokingTripComponent;
  let fixture: ComponentFixture<BokingTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BokingTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BokingTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
