import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverbookigDataComponent } from './driverbookig-data.component';

describe('DriverbookigDataComponent', () => {
  let component: DriverbookigDataComponent;
  let fixture: ComponentFixture<DriverbookigDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverbookigDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverbookigDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
