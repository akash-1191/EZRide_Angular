import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyownerComponent } from './verifyowner.component';

describe('VerifyownerComponent', () => {
  let component: VerifyownerComponent;
  let fixture: ComponentFixture<VerifyownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyownerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
