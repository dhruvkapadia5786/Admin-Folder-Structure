import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSetsComponent } from './banner-sets.component';

describe('BannerSetsComponent', () => {
  let component: BannerSetsComponent;
  let fixture: ComponentFixture<BannerSetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerSetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
