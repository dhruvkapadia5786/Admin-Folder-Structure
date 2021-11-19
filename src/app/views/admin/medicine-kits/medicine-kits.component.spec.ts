import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineKitsComponent } from './medicine-kits.component';

describe('MedicineKitsComponent', () => {
  let component: MedicineKitsComponent;
  let fixture: ComponentFixture<MedicineKitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineKitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineKitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
