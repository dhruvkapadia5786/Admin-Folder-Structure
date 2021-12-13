import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {
  public questionDetails: any;
  public checkboxColor = 'primary';
  public questionId;
  constructor(public http: HttpClient, private route: ActivatedRoute, private _changeDetectorRef: ChangeDetectorRef) {
    this.questionId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getQuestionDetails();
  }
  getQuestionDetails() {
    // const url = 'api/questions/details/' + this.questionId;
    const url = 'api/questions/view/' + this.questionId;
    this.http.get(url)
      .subscribe((questionDetails: any) => {
        this.questionDetails = questionDetails;
        this._changeDetectorRef.detectChanges();
      }, err => {
      });
  }

  updateMedicineKitStatus(event: any, kit: any) {
    const url = 'api/questions/manage_question_kits';
    const obj = {
      'id': kit.id,
      'is_active': kit.is_active
    }
    this.http.post(url, obj)
      .subscribe((data: any) => {
        this.getQuestionDetails();
        this._changeDetectorRef.detectChanges();
      }, err => {
      });
  }

  updateStateStatus(event: any, state: any) {
    const url = 'api/questions/manage_question_states';
    const obj = {
      'id': state._id,
      'is_active': state.is_active
    }
    this.http.post(url, obj)
      .subscribe((data: any) => {
        this.getQuestionDetails();
        this._changeDetectorRef.detectChanges();
      }, err => {
      });
  }

}
