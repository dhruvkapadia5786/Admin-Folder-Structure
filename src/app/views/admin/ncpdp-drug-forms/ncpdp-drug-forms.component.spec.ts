import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcpdpDrugFormsComponent } from './ncpdp-drug-forms.component';

describe('NcpdpDrugFormsComponent', () => {
  let component: NcpdpDrugFormsComponent;
  let fixture: ComponentFixture<NcpdpDrugFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcpdpDrugFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcpdpDrugFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
