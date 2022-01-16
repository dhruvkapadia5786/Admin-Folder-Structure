import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerlinkModalComponent } from './bannerlink-modal.component';

describe('BannerlinkModalComponent', () => {
  let component: BannerlinkModalComponent;
  let fixture: ComponentFixture<BannerlinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerlinkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerlinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
