import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQuestionAnswerComponent } from './order-question-answer.component';

describe('OrderQuestionAnswerComponent', () => {
  let component: OrderQuestionAnswerComponent;
  let fixture: ComponentFixture<OrderQuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderQuestionAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
