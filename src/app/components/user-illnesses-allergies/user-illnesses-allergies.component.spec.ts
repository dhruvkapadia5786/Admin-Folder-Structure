import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIllnessesAllergiesComponent } from './user-illnesses-allergies.component';

describe('UserIllnessesAllergiesComponent', () => {
  let component: UserIllnessesAllergiesComponent;
  let fixture: ComponentFixture<UserIllnessesAllergiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIllnessesAllergiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIllnessesAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
