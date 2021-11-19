import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoumentListComponent } from './doument-list.component';

describe('DoumentListComponent', () => {
  let component: DoumentListComponent;
  let fixture: ComponentFixture<DoumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
