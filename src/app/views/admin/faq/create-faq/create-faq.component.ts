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
  public FAQCategory: any[] = [
    {name: 'Home', value: 'HOME'},
    {name: 'Order', value: 'ORDER'},
    {name: 'Consultation', value: 'CONSULTATION'},
    {name: 'Drug Order', value: 'DRUG_ORDER'},
  ];
  public eventInfo!: string;

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _http: HttpClient,
    private _helper: Helper
  ) {
    this.editor = new Editor();
  }

  ngOnInit() {
    this.FAQForm = new FormGroup({
      'category': new FormControl([],[Validators.required]),
      'question': new FormControl(null, [Validators.required]),
      'answer': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true)
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get category() { return this.FAQForm.get('category'); }
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
    const url = 'api/faqs/create';
    const reqData = this.FAQForm.value;

    this._http.post(url, reqData).subscribe((data: any) => {
      this._router.navigate(['/admin/faq']);
      this._toastr.showSuccess('Save Successfully!');
      this._changeDetectorRef.detectChanges();
    },
      err => {
        this._toastr.showError('Unable to save FAQ!');
        this._changeDetectorRef.detectChanges();
      });
  }
}
