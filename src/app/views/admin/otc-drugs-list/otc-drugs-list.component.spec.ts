import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcDrugsListComponent } from './otc-drugs-list.component';

describe('OtcDrugsListComponent', () => {
  let component: OtcDrugsListComponent;
  let fixture: ComponentFixture<OtcDrugsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcDrugsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcDrugsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
