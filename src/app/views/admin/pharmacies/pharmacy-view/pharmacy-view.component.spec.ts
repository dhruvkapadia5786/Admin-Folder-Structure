import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyViewComponent } from './pharmacy-view.component';

describe('PharmacyViewComponent', () => {
  let component: PharmacyViewComponent;
  let fixture: ComponentFixture<PharmacyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
