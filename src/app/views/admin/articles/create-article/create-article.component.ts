import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Editor } from 'ngx-editor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {
  editor: Editor;
  answerText:string='';
  public articleId: any;
  public articleForm!: UntypedFormGroup;
  public eventInfo!: string;
  categoriesDetails:any=[];
  articleDetails:any;

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
    this.articleForm = new UntypedFormGroup({
      'image_url': new UntypedFormControl(null, []),
      'categories': new UntypedFormControl([], []),
      'title': new UntypedFormControl(null, [Validators.required]),
      'body': new UntypedFormControl(null, [Validators.required]),
      'status':new UntypedFormControl(null, [Validators.required]),
      'is_active': new UntypedFormControl(true),
      'tags':new UntypedFormArray([])
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
  get status() { return this.articleForm.get('status'); }
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
        this.imageUrl = res.coverimage ? environment.api_url+res.coverimage: '../../../../../assets/img/no_preview.png';
        this.articleDetails = res;
        this.articleForm.patchValue({
          title: res.title,
          body: res.body,
          status:res.status,
          categories:res.categories ? res.categories.map((item:any)=>item.id):[],
          is_active:  res.is_active
        })
        this.answerText = res.body;
      }, (err:any) => {

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

    let formVal = this.articleForm.value;
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(formVal.body, "text/html");
    formVal.plainbody = oDOM.body.innerText;


    const formData: FormData = new FormData();
    formVal.coverimage = this.articleDetails.coverimage;
    formData.append('article', JSON.stringify(formVal));
    formData.append('image_url', this.selectedImageFile);

    const url = this.articleId ? 'api/admin/articles/update/'+this.articleId:'api/admin/articles/create';
    this._http.post(url, formData).subscribe((data: any) => {
        this._router.navigate(['/admin/articles']);
        this._toastr.showSuccess('Save Successfully!');
    },
    (err:any) => {
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
