import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSetEditComponent } from './banner-set-edit.component';

describe('BannerSetEditComponent', () => {
  let component: BannerSetEditComponent;
  let fixture: ComponentFixture<BannerSetEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerSetEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
