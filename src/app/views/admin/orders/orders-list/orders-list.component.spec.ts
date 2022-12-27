import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugOrdersListComponent } from './orders-list.component';

describe('DrugOrdersListComponent', () => {
  let component: DrugOrdersListComponent;
  let fixture: ComponentFixture<DrugOrdersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugOrdersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
