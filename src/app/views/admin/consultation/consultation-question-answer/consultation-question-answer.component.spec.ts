import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationQuestionAnswerComponent } from './consultation-question-answer.component';

describe('ConsultationQuestionAnswerComponent', () => {
  let component: ConsultationQuestionAnswerComponent;
  let fixture: ComponentFixture<ConsultationQuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationQuestionAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
