import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyEditComponent } from './pharmacy-edit.component';

describe('PharmacyEditComponent', () => {
  let component: PharmacyEditComponent;
  let fixture: ComponentFixture<PharmacyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
