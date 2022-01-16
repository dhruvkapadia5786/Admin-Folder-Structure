import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSetViewComponent } from './banner-set-view.component';

describe('BannerSetViewComponent', () => {
  let component: BannerSetViewComponent;
  let fixture: ComponentFixture<BannerSetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerSetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
