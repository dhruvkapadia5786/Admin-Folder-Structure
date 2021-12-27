import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackformsComponent } from './packforms.component';

describe('PackformsComponent', () => {
  let component: PackformsComponent;
  let fixture: ComponentFixture<PackformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
