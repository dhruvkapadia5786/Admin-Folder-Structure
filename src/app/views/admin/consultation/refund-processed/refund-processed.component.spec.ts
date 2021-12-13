import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundProcessedComponent } from './refund-processed.component';

describe('RefundProcessedComponent', () => {
  let component: RefundProcessedComponent;
  let fixture: ComponentFixture<RefundProcessedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundProcessedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundProcessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});