import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedicineKitsComponent } from './edit-medicine-kits.component';

describe('EditMedicineKitsComponent', () => {
  let component: EditMedicineKitsComponent;
  let fixture: ComponentFixture<EditMedicineKitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMedicineKitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMedicineKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
