import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrderSubscriptionModalComponent } from './drug-order-subscription-modal.component';

describe('DrugOrderSubscriptionModalComponent', () => {
  let component: DrugOrderSubscriptionModalComponent;
  let fixture: ComponentFixture<DrugOrderSubscriptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugOrderSubscriptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrderSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
