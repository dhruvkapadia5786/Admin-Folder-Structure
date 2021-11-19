import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestModalComponent } from './refund-request-modal.component';

describe('RefundRequestModalComponent', () => {
  let component: RefundRequestModalComponent;
  let fixture: ComponentFixture<RefundRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
