import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesProductsComponent } from './contactlenses-products.component';

describe('ContactlensesProductsComponent', () => {
  let component: ContactlensesProductsComponent;
  let fixture: ComponentFixture<ContactlensesProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactlensesProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
