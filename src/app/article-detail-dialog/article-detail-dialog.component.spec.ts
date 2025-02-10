import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailDialogComponent } from './article-detail-dialog.component';

describe('ArticleDetailDialogComponent', () => {
  let component: ArticleDetailDialogComponent;
  let fixture: ComponentFixture<ArticleDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
