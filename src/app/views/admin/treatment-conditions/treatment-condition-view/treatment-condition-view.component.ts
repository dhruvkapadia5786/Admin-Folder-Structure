import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { TreatmentConditionAddEditModalComponent } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.component';
import { TreatmentConditionAddEditModalService } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.service';

@Component({
  selector: 'app-treatment-condition-view',
  templateUrl: './treatment-condition-view.component.html',
  styleUrls: ['./treatment-condition-view.component.scss']
})
export class TreatmentConditionViewComponent implements OnInit {
  selectedConditionId: any;
  public conditions: any[] = [];
  modalRef!: BsModalRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: BsModalService,
    private _tcAddEditModalService: TreatmentConditionAddEditModalService,
    private _changeDetectorRef: ChangeDetectorRef){
    let activatedRoute :any =  this.route;
    if(activatedRoute){
      this.selectedConditionId = activatedRoute.parent.snapshot.paramMap.get('treatment_condition_id');
    }
  }

  ngOnInit(){
    this.getAllTreatmentConditionList();
  }

  public getAllTreatmentConditionList(){
    const url = 'api/treatment_conditions/all';
    this.http.get(url).subscribe((conditionsList: any) => {
        this.conditions = conditionsList;
        this._changeDetectorRef.detectChanges();
      },(err:any) => {

      });
  }

  public onTreatmentChange(conditionId: any){
    this.router.navigate(['admin','treatment-conditions','view',conditionId,'info'])
  }

  openAddModal(){
    this._tcAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(TreatmentConditionAddEditModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{

    });
  }

  openEditModal(id:any){
    let data = this.conditions.find((item:any)=>item._id == id);
    this._tcAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(TreatmentConditionAddEditModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.getAllTreatmentConditionList();
    });
  }

}
