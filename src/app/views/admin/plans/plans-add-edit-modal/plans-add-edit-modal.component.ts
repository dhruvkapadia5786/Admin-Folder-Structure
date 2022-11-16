import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
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
  subscriptionPlanForm: FormGroup;
  countriesList:any[]=[];

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: PlansAddEditModalService
  ) {
    this.subscriptionPlanForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'duration': new FormControl(null, [Validators.required]),
      'duration_unit': new FormControl(null, [Validators.required]),
      'charge': new FormControl(null, [Validators.required]),
      'currency': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
    });
  }

  get id() { return this.subscriptionPlanForm.get('id'); }
  get name() { return this.subscriptionPlanForm.get('name'); }
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
