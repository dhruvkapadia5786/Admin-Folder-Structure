import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesTypesAddEditModalComponent } from './contactlenses-types-add-edit-modal.component';

describe('ContactlensesTypesAddEditModalComponent', () => {
  let component: ContactlensesTypesAddEditModalComponent;
  let fixture: ComponentFixture<ContactlensesTypesAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactlensesTypesAddEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesTypesAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
