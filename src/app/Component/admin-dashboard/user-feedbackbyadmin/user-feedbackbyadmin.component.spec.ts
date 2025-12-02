import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeedbackbyadminComponent } from './user-feedbackbyadmin.component';

describe('UserFeedbackbyadminComponent', () => {
  let component: UserFeedbackbyadminComponent;
  let fixture: ComponentFixture<UserFeedbackbyadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFeedbackbyadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFeedbackbyadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
