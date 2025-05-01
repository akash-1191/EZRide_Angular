import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnDashboardComponent } from './own-dashboard.component';

describe('OwnDashboardComponent', () => {
  let component: OwnDashboardComponent;
  let fixture: ComponentFixture<OwnDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
