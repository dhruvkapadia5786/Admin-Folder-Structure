import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOtcSubcategoryModalComponent } from './select-otc-subcategory-modal.component';

describe('SelectOtcSubcategoryModalComponent', () => {
  let component: SelectOtcSubcategoryModalComponent;
  let fixture: ComponentFixture<SelectOtcSubcategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOtcSubcategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOtcSubcategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
