import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesInfoComponent } from './attributes-info.component';

describe('AttributesInfoComponent', () => {
  let component: AttributesInfoComponent;
  let fixture: ComponentFixture<AttributesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
