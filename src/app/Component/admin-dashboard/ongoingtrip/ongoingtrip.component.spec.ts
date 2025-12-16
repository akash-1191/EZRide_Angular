import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingtripComponent } from './ongoingtrip.component';

describe('OngoingtripComponent', () => {
  let component: OngoingtripComponent;
  let fixture: ComponentFixture<OngoingtripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingtripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
