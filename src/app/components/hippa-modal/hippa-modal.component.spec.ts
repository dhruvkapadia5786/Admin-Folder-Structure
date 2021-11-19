import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HippaModalComponent } from './hippa-modal.component';

describe('HippaModalComponent', () => {
  let component: HippaModalComponent;
  let fixture: ComponentFixture<HippaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HippaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HippaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
