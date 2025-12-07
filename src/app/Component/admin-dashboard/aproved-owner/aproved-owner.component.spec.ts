import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovedOwnerComponent } from './aproved-owner.component';

describe('AprovedOwnerComponent', () => {
  let component: AprovedOwnerComponent;
  let fixture: ComponentFixture<AprovedOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovedOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprovedOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
