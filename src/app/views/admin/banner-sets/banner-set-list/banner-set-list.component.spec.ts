import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSetListComponent } from './banner-set-list.component';

describe('BannerSetListComponent', () => {
  let component: BannerSetListComponent;
  let fixture: ComponentFixture<BannerSetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerSetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
