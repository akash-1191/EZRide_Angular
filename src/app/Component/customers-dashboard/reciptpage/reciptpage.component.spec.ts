import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptpageComponent } from './reciptpage.component';

describe('ReciptpageComponent', () => {
  let component: ReciptpageComponent;
  let fixture: ComponentFixture<ReciptpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciptpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReciptpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
