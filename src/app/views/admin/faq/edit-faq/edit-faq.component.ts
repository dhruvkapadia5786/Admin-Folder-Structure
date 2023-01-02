import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-edit-faq',
  templateUrl: './edit-faq.component.html',
  styleUrls: ['./edit-faq.component.scss']
})
export class EditFaqComponent implements OnInit {
  editor: Editor;
  answerText:string='';

  public FAQId: any;
  public FAQForm: FormGroup;
  public FAQDetailsObj: any;
  public FAQgroup:any=[];

  public eventInfo!: string;
  public selectedNotificationEvent!: number;
  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _http: HttpClient,
    public activeRoute: ActivatedRoute,
    private _helper: Helper
  ) {

    this.editor = new Editor();
    this.FAQId = this.activeRoute.snapshot.paramMap.get('id');
    this.FAQForm = new FormGroup({
      'group_id': new FormControl([], [Validators.required]),
      'question': new FormControl(null, [Validators.required]),
      'answer': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true)
    });
  }

  getFAQGroups(){
    const url = 'api/admin/faqs/all-group';
    this._http.get(url).subscribe((data: any) => {
      this.FAQgroup = data;
    },(err)=>{

    });
  }
  ngOnInit(){
    this.getFAQGroups();
    this.FAQDetailsObj = {
      group_id: '',
      question: '',
      answer: '',
      is_active: true
    }
    this.getFAQDetails();
  }

  patchAnswer(){
    this.FAQForm.patchValue({
      answer:this.answerText
    });
  }

  getFAQDetails(){
    const url = 'api/admin/faqs/view/' + this.FAQId;
    this._http.get(url)
      .subscribe((res: any) => {
        this.FAQDetailsObj = res;
        this.FAQForm.patchValue({
          group_id: this.FAQDetailsObj.group_id,
          question: this.FAQDetailsObj.question,
          answer: this.FAQDetailsObj.answer,
          is_active:  this.FAQDetailsObj.is_active
        })
        this.answerText = this.FAQDetailsObj.answer;
      }, (err:any) => {

      });
  }
  get group_id() { return this.FAQForm.get('group_id'); }
  get question() { return this.FAQForm.get('question'); }
  get answer() { return this.FAQForm.get('answer'); }
  get is_active() { return this.FAQForm.get('is_active'); }

  saveFAQ() {
    if (this.FAQForm.invalid) {
      this._helper.markFormGroupTouched(this.FAQForm);
      return;
    }
    const url = 'api/admin/faqs/update/' + this.FAQId;
    const req = this.FAQForm.value;
    this._http.post(url, req).subscribe((data: any) => {
      this._router.navigate(['/admin/faq/list']);
      this._toastr.showSuccess('Save Successfully!');
      this._changeDetectorRef.detectChanges();
    }, (err:any) => {
      this._toastr.showError('Unable To Update FAQ!');
      this._changeDetectorRef.detectChanges();
    });
  }
}
