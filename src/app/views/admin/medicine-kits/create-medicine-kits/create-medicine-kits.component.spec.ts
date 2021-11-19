import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMedicineKitsComponent } from './create-medicine-kits.component';

describe('CreateMedicineKitsComponent', () => {
  let component: CreateMedicineKitsComponent;
  let fixture: ComponentFixture<CreateMedicineKitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMedicineKitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMedicineKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
