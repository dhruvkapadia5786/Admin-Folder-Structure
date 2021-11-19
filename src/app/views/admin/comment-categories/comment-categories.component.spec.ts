import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCategoriesComponent } from './comment-categories.component';

describe('CommentCategoriesComponent', () => {
  let component: CommentCategoriesComponent;
  let fixture: ComponentFixture<CommentCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
