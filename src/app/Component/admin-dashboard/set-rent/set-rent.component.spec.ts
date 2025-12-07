import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRentComponent } from './set-rent.component';

describe('SetRentComponent', () => {
  let component: SetRentComponent;
  let fixture: ComponentFixture<SetRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
