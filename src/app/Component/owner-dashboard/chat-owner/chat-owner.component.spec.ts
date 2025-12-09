import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatOwnerComponent } from './chat-owner.component';

describe('ChatOwnerComponent', () => {
  let component: ChatOwnerComponent;
  let fixture: ComponentFixture<ChatOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
