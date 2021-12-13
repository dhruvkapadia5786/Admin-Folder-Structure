import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestedComponent } from './refund-requested.component';

describe('RefundRequestedComponent', () => {
  let component: RefundRequestedComponent;
  let fixture: ComponentFixture<RefundRequestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundRequestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});