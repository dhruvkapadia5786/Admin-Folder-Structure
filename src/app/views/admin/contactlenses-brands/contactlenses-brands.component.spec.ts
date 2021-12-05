import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesBrandsComponent } from './contactlenses-brands.component';

describe('ContactlensesBrandsComponent', () => {
  let component: ContactlensesBrandsComponent;
  let fixture: ComponentFixture<ContactlensesBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactlensesBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
