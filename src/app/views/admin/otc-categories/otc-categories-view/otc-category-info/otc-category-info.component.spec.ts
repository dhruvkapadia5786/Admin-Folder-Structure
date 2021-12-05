import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcCategoryInfoComponent } from './otc-category-info.component';

describe('OtcCategoryInfoComponent', () => {
  let component: OtcCategoryInfoComponent;
  let fixture: ComponentFixture<OtcCategoryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcCategoryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcCategoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
