import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreeFormConsentModalComponent } from './free-form-consent-modal.component';

describe('FreeFormConsentModalComponent', () => {
  let component: FreeFormConsentModalComponent;
  let fixture: ComponentFixture<FreeFormConsentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeFormConsentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeFormConsentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
