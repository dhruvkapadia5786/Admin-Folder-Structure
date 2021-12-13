import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrdersViewComponent } from './drug-orders-view.component';

describe('DrugOrdersViewComponent', () => {
  let component: DrugOrdersViewComponent;
  let fixture: ComponentFixture<DrugOrdersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugOrdersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
