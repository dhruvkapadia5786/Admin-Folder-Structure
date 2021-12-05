import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-sequence',
  templateUrl: './change-sequence.component.html',
  styleUrls: ['./change-sequence.component.scss']
})
export class ChangeSequenceComponent implements OnInit {
  public conditions: any = [];
  public medicineKits: any = [];
  public questions: any = [];
  public originalQuestions: any = [];
  public selectedConditionId: any = null;
  public selectedKitId: any = null;
  public isSequenceUpdated = false;

  selectedCategory: any = 'ORDER';
  public categoryList: any = [
    { type: 'Order', value: 'ORDER' },
    { type: 'Consultation', value: 'CONSULTATION' }
  ]

  medicineKitId: any;
  healthConditionId: any;
  showHeaderAndFilter: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public toaster: ToastrService,
    public cdr: ChangeDetectorRef
  ) {
    this.medicineKitId = this.route.parent?.parent?.snapshot.paramMap.get('kit_id');
    this.healthConditionId = this.route.parent?.parent?.snapshot.paramMap.get('condition_id');
    
    if (this.medicineKitId) {
      this.showHeaderAndFilter = false
      this.selectedKitId = this.medicineKitId;
      this.getQuestionsList();
    }
    
    if (this.healthConditionId) {
      this.showHeaderAndFilter = false
      this.selectedCategory = 'CONSULTATION';
      this.selectedConditionId = this.healthConditionId;
      this.getQuestionsList();
    }
  }

  ngOnInit() {
    this.getMedicineKits();
    this.getAllHealthConditions();
  }

  public getAllHealthConditions() {
    const url = 'api/consultation_health_conditions/all';
    this.http.get(url)
      .subscribe((conditionsList: any) => {
        this.conditions = conditionsList;
        this.cdr.detectChanges();
      }, err => {
        
      });
  }

  public getMedicineKits() {
    const url = 'api/medicine_kits/all';
    this.http.get(url)
      .subscribe((medicineKitList: any) => {
        this.medicineKits = medicineKitList;
        this.cdr.detectChanges();
      }, err => {
        
      });
  }

  public getQuestionsList() {
    if (this.selectedKitId != null || this.selectedConditionId != null) {
      let url: string = this.selectedCategory == 'ORDER' ? 'api/medicine_kits/questions/' + this.selectedKitId : 'api/consultation_health_conditions/questions/' + this.selectedConditionId;
      this.http.get(url)
        .subscribe((data: any) => {
          this.questions = data;
          this.originalQuestions = data.slice(0);
          this.cdr.detectChanges();
        }, err => {
          
        });
    } else {
      this.toaster.warning('Please select kit/condition.');
      return;
    }
  }

  public resetValues() {
    this.medicineKits = [];
    this.questions = [];
    this.selectedKitId = null;
  }

  public resetSequence() {
    this.questions = this.originalQuestions.slice(0);
    this.isSequenceUpdated = false;
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questions, event.previousIndex, event.currentIndex);
    this.isSequenceUpdated = true;
  }

  public saveUpdatedSequence() {
    let sequenceArray: any[] = []
    this.questions.forEach((que: any, index: any) => {
      sequenceArray.push({ question_id: que.question_id._id, sequence: (index + 1), _id: que._id });
    });
    
    let url: string = this.selectedCategory == 'ORDER' ? `api/medicine_kits/update_question_sequence/${this.selectedKitId}` : `api/consultation_health_conditions/update_question_sequence/${this.selectedConditionId}`;
    this.http.post(url, { sequences: sequenceArray })
      .subscribe(data => {
        this.toaster.success('Sequence Updated Successfully');
        this.questions = [];
        this.isSequenceUpdated = false;
        
        /* Redirect to parent when this component used as child */
        if (this.medicineKitId) {
          this.redirectTo(`/admin/medicine-kits/view/${this.medicineKitId}/question-sequence`)
        }
        if (this.healthConditionId) {
          this.redirectTo(`/admin/consultation-health-conditions/view/${this.healthConditionId}/question-sequence`)
        }
      }, err => {
        this.toaster.error('Unable to update sequence. Please try again');
      });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>this.router.navigate([uri]));
  }

  handleChange(category: any) {
    if (category == 'ORDER') {
      this.selectedConditionId = null
    } else if (category == 'CONSULTATION') {
      this.selectedKitId = null
    }
  }

}
