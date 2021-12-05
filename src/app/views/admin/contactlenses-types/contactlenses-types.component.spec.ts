import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesTypesComponent } from './contactlenses-types.component';

describe('ContactlensesTypesComponent', () => {
  let component: ContactlensesTypesComponent;
  let fixture: ComponentFixture<ContactlensesTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactlensesTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
