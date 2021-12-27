import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugFormsComponent } from './drugforms.component';

describe('DrugFormsComponent', () => {
  let component: DrugFormsComponent;
  let fixture: ComponentFixture<DrugFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
