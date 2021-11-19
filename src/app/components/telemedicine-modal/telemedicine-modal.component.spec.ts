import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemedicineModalComponent } from './telemedicine-modal.component';

describe('TelemedicineModalComponent', () => {
  let component: TelemedicineModalComponent;
  let fixture: ComponentFixture<TelemedicineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelemedicineModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemedicineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
