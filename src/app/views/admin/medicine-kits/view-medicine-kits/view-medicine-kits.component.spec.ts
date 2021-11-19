import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicineKitsComponent } from './view-medicine-kits.component';

describe('ViewMedicineKitsComponent', () => {
  let component: ViewMedicineKitsComponent;
  let fixture: ComponentFixture<ViewMedicineKitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMedicineKitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMedicineKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
