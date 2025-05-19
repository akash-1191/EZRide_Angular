import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagevehicleComponent } from './managevehicle.component';

describe('ManagevehicleComponent', () => {
  let component: ManagevehicleComponent;
  let fixture: ComponentFixture<ManagevehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagevehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagevehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
