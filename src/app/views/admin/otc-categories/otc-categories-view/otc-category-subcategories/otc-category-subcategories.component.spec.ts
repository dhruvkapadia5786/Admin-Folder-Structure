import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcCategorySubcategoriesComponent } from './otc-category-subcategories.component';

describe('OtcCategorySubcategoriesComponent', () => {
  let component: OtcCategorySubcategoriesComponent;
  let fixture: ComponentFixture<OtcCategorySubcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcCategorySubcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcCategorySubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
