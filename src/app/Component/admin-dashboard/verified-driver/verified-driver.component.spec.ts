import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedDriverComponent } from './verified-driver.component';

describe('VerifiedDriverComponent', () => {
  let component: VerifiedDriverComponent;
  let fixture: ComponentFixture<VerifiedDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedDriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
