import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSetCreateComponent } from './banner-set-create.component';

describe('BannerSetCreateComponent', () => {
  let component: BannerSetCreateComponent;
  let fixture: ComponentFixture<BannerSetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerSetCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerSetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
