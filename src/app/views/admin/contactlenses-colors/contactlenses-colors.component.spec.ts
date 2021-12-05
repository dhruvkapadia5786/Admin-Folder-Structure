import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactlensesColorsComponent } from './contactlenses-colors.component';

describe('ContactlensesColorsComponent', () => {
  let component: ContactlensesColorsComponent;
  let fixture: ComponentFixture<ContactlensesColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactlensesColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactlensesColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
