import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMdemoComponent } from './driver-mdemo.component';

describe('DriverMdemoComponent', () => {
  let component: DriverMdemoComponent;
  let fixture: ComponentFixture<DriverMdemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverMdemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverMdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
