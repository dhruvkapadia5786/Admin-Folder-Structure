import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { PlansAddEditModalService } from './plans-add-edit-modal.service';

@Component({
  selector: 'app-plans-add-edit-modal',
  templateUrl: './plans-add-edit-modal.component.html',
  styleUrls: ['./plans-add-edit-modal.component.scss']
})
export class PlansAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  subscriptionPlanForm: UntypedFormGroup;
  countriesList:any[]=[];

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: UntypedFormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: PlansAddEditModalService
  ) {
    this.subscriptionPlanForm = this.formBuilder.group({
      'id':new UntypedFormControl(null, []),
      'name': new UntypedFormControl(null, [Validators.required]),
      'plan_for': new UntypedFormControl(null, [Validators.required]),
      'description': new UntypedFormControl(null, [Validators.required]),
      'duration': new UntypedFormControl(null, [Validators.required]),
      'duration_unit': new UntypedFormControl(null, [Validators.required]),
      'charge': new UntypedFormControl(null, [Validators.required]),
      'currency': new UntypedFormControl(null, [Validators.required]),
      'is_active': new UntypedFormControl(null, []),
    });
  }

  get id() { return this.subscriptionPlanForm.get('id'); }
  get name() { return this.subscriptionPlanForm.get('name'); }
  get plan_for(){return this.subscriptionPlanForm.get('plan_for');}
  get description(){return this.subscriptionPlanForm.get('description');}
  get duration() { return this.subscriptionPlanForm.get('duration'); }
  get duration_unit() { return this.subscriptionPlanForm.get('duration_unit'); }
  get charge() { return this.subscriptionPlanForm.get('charge'); }
  get currency() { return this.subscriptionPlanForm.get('currency'); }
  get is_active() { return this.subscriptionPlanForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    this.countriesList = details.countriesList;
    if(details.event == 'EDIT'){
      this.subscriptionPlanForm.patchValue({
        id:details.data.id,
        name:details.data.name,
        plan_for:details.data.plan_for,
        description:details.data.description,
        duration:details.data.duration,
        duration_unit:details.data.duration_unit,
        charge:details.data.charge,
        currency:details.data.currency,        
        is_active:details.data.is_active,
      });
    }
  }

  async saveTreatmentCondition(formValid:boolean){
    if(formValid){
      let categoryVal = this.subscriptionPlanForm.value;  
      if(this.modalEvent == 'ADD'){
        let create = await  this._tcAddEditModalService.addNewPlan(categoryVal);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._tcAddEditModalService.editPlan(categoryVal.id,categoryVal);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.subscriptionPlanForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.subscriptionPlanForm);
    }
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

  closeModal(){
    this._bsModalRef.hide();
  }
}
