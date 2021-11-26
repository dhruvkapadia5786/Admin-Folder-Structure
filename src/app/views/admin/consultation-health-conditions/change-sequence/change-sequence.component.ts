import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-sequence',
  templateUrl: './change-sequence.component.html',
  styleUrls: ['./change-sequence.component.scss']
})
export class ChangeSequenceComponent implements OnInit {

  public healthconditions: any[] = [];
  public originalHealthconditions: any[] = [];
  
  public isSequenceUpdated = false;
  public sequenceArray: {
    healthconditions_id: number;
    sequence: number
  }[] = [];

  constructor(
    public http: HttpClient,
    public toaster: ToastrService,
    public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getHealthConditionsList();
  }

  public getHealthConditionsList() {
    const url = 'api/v1/admin/consultation/health_condition/all';
    this.http.get(url).subscribe((data: any) => {
      this.healthconditions = data;
      this.originalHealthconditions =this.healthconditions;
      this.cdr.detectChanges();
    }, err => {});
  }

  public resetValues() {
    this.healthconditions = [];
  }

  public resetSequence() {
    this.healthconditions = this.originalHealthconditions.slice(0);
    this.isSequenceUpdated = false;
  }

  public drop(event: any) { // arg. type CdkDragDrop<string[]>
    moveItemInArray(this.healthconditions, event.previousIndex, event.currentIndex);
    this.isSequenceUpdated = true;
  }

  public saveUpdatedSequence() {
    this.sequenceArray = [];
    this.healthconditions.forEach((hc, index) => {
      this.sequenceArray.push({ healthconditions_id: hc.id, sequence: (index + 1)});
    });
    const url = 'api/v1/admin/consultation/health_condition/update_priority';
    this.http.post(url, { sequences: this.sequenceArray })
      .subscribe(data => {
        this.toaster.success('Priority Updated Successfully');
        this.sequenceArray = [];
        this.healthconditions = [];
        this.isSequenceUpdated = false;
        this.getHealthConditionsList();
      }, err => {                                       
        this.toaster.error('Unable to update Priority. Please try again');
      });
  }
}
