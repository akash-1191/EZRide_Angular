import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritydepositRefaundAdminComponent } from './securitydeposit-refaund-admin.component';

describe('SecuritydepositRefaundAdminComponent', () => {
  let component: SecuritydepositRefaundAdminComponent;
  let fixture: ComponentFixture<SecuritydepositRefaundAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritydepositRefaundAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritydepositRefaundAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
