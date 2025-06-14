import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRidesComponent } from './current-rides.component';

describe('CurrentRidesComponent', () => {
  let component: CurrentRidesComponent;
  let fixture: ComponentFixture<CurrentRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentRidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
