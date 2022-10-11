import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {
  editor: Editor;
  answerText:string='';
  public articleId: any;
  public articleForm!: FormGroup;
  public eventInfo!: string;
  categoriesDetails:any=[];

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _http: HttpClient,
    public activeRoute: ActivatedRoute,
    private _helper: Helper){
    this.editor = new Editor();
    this.articleId = this.activeRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(){
    this.getCategories();
    this.articleForm = new FormGroup({
      'image_url': new FormControl(null, []),
      'categories': new FormControl([], []),
      'title': new FormControl(null, [Validators.required]),
      'body': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true),
      'tags':new FormArray([])
    });
    if(this.articleId){
       this.getArticleDetails();
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get title() { return this.articleForm.get('title'); }
  get body() { return this.articleForm.get('body'); }
  get is_active() { return this.articleForm.get('is_active'); }
  get image_url() { return this.articleForm.get('image_url'); }
  get categories() { return this.articleForm.get('categories'); }

  patchAnswer(){
    this.articleForm.patchValue({
      body:this.answerText
    });
  }

  getArticleDetails(){
    const url = 'api/admin/articles/view/' + this.articleId;
    this._http.get(url).subscribe((res: any) => {
        this.articleForm.patchValue({
          title: res.title,
          body: res.body,
          categories:res.categories ? res.categories.map((item:any)=>item.id):[],
          is_active:  res.is_active
        })
        this.answerText = res.body;
      }, err => {

      });
  }

  getCategories(){
    const url = 'api/admin/article_categories/all';
    this._http.get(url).subscribe((res: any) => {
        this.categoriesDetails = res;
      },(err) => {
        this.categoriesDetails =[];
      });
  }

  saveArticle(){
    if (this.articleForm.invalid){
      this._helper.markFormGroupTouched(this.articleForm);
      return;
    }

    const formData: FormData = new FormData();
    formData.append('article', JSON.stringify(this.articleForm.value));
    formData.append('image_url', this.selectedImageFile);

    const url = this.articleId ? 'api/admin/articles/update/'+this.articleId:'api/admin/articles/create';
    this._http.post(url, formData).subscribe((data: any) => {
        this._router.navigate(['/admin/articles']);
        this._toastr.showSuccess('Save Successfully!');
    },
    err => {
        this._toastr.showError('Unable to save article !');
    });
  }


  onFileChange(event:any, type: string) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (type == 'IMAGE') {
          this.imageUrl = reader.result;
          this.selectedImageFile = file;
        }
        this._changeDetectorRef.markForCheck();
      }
    }
  }

}
