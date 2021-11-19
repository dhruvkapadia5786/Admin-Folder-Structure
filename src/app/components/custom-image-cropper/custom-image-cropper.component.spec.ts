import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImageCropperComponent } from './custom-image-cropper.component';

describe('CustomImageCropperComponent', () => {
  let component: CustomImageCropperComponent;
  let fixture: ComponentFixture<CustomImageCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomImageCropperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
