import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../../../services/helper.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-create-faq',
  templateUrl: './create-faq.component.html',
  styleUrls: ['./create-faq.component.scss']
})
export class CreateFaqComponent implements OnInit {
  editor: Editor;
  answerText:string='';
  public FAQForm!: FormGroup;
  public FAQgroup:any=[];
  public eventInfo!: string;

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _http: HttpClient,
    private _helper: Helper){
    this.editor = new Editor();
  }

  getFAQGroups(){
    const url = 'api/admin/faqs/all-group';
    this._http.get(url).subscribe((data: any) => {
      this.FAQgroup = data;
    },(err)=>{

    });
  }

  ngOnInit() {
    this.getFAQGroups();
    this.FAQForm = new FormGroup({
      'group_id': new FormControl([],[Validators.required]),
      'question': new FormControl(null, [Validators.required]),
      'answer': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true)
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get group_id() { return this.FAQForm.get('group_id'); }
  get question() { return this.FAQForm.get('question'); }
  get answer() { return this.FAQForm.get('answer'); }
  get is_active() { return this.FAQForm.get('is_active'); }

  patchAnswer(){
    this.FAQForm.patchValue({
      answer:this.answerText
    });
  }

  saveFAQ() {
    if (this.FAQForm.invalid) {
      this._helper.markFormGroupTouched(this.FAQForm);
      return;
    }
    const url = 'api/admin/faqs/create';
    const reqData = this.FAQForm.value;
    this._http.post(url, reqData).subscribe((data: any) => {
        this._router.navigate(['/admin/faq']);
        this._toastr.showSuccess('Save Successfully!');
      },
      err => {
        this._toastr.showError('Unable to save FAQ!');
      });
  }
}
