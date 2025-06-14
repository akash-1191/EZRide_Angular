import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactmessaegComponent } from './contactmessaeg.component';

describe('ContactmessaegComponent', () => {
  let component: ContactmessaegComponent;
  let fixture: ComponentFixture<ContactmessaegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactmessaegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactmessaegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
