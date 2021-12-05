import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesColorAddEditModalComponent } from './contactlenses-color-add-edit-modal.component';

describe('ContactlensesColorAddEditModalComponent', () => {
  let component: ContactlensesColorAddEditModalComponent;
  let fixture: ComponentFixture<ContactlensesColorAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactlensesColorAddEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesColorAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
