import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LensParametersModalComponent } from './lens-parameters-modal.component';

describe('LensParametersModalComponent', () => {
  let component: LensParametersModalComponent;
  let fixture: ComponentFixture<LensParametersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LensParametersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LensParametersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
