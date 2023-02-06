import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { CategoriesAddEditModalService } from './categories-add-edit-modal.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categories-add-edit-modal',
  templateUrl: './categories-add-edit-modal.component.html',
  styleUrls: ['./categories-add-edit-modal.component.scss']
})
export class CategoriesAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  treatmentConditionForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any
  categoryDetails:any;
  attributesData:any[]=[];


  constructor(
    private _http: HttpClient,
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: CategoriesAddEditModalService){
    this.getAllAttributesData();

    this.treatmentConditionForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'description': new FormControl(null, []),
      'image_url': new FormControl(null, []),
      'attributes':new FormArray([])
    });
  }

  get id() { return this.treatmentConditionForm.get('id'); }
  get name() { return this.treatmentConditionForm.get('name'); }
  get is_active() { return this.treatmentConditionForm.get('is_active'); }
  get description() { return this.treatmentConditionForm.get('description'); }
  get image_url() { return this.treatmentConditionForm.get('image_url'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.getCategoryDetails(details.data.id);
    }
  }

  getCategoryDetails(id:number){
    const url = 'api/admin/categories/view/'+id;
    this._http.get(url).subscribe((res: any) => {
      this.categoryDetails = res;
      this.patchFormValue();
    },(err) => {
      this.categoryDetails = null;
    });
  }

  patchFormValue(){
    this.treatmentConditionForm.patchValue({
      id:this.categoryDetails.id,
      category_id:this.categoryDetails.category_id,
      name:this.categoryDetails.name,
      is_active:this.categoryDetails.is_active,
      description:this.categoryDetails.description
    });
    this.imageUrl = this.categoryDetails.image_url ? environment.api_url + this.categoryDetails.image_url : `../../../../../assets/img/no_preview.png`;
    const attributesControl = this.treatmentConditionForm.get('attributes') as FormArray;
    if(this.categoryDetails.attributes){
      this.categoryDetails.attributes.forEach((item:any)=>{
        let attributeFormGroup = new FormGroup({
          'attribute_id':new FormControl(item.attribute_id, [Validators.required]),
          'values':new FormControl(item.values_ids, [Validators.required]),
        });
        attributesControl.push(attributeFormGroup);
      });
    }
  }

  getAllAttributesData(){
    const url = 'api/admin/attributes/all';
    this._http.get(url).subscribe((res: any) => {
        this.attributesData = res;
      },(err) => {
        this.attributesData =[];
      });
  }

  attrChange(index:number,event:any){
    this.attributes().at(index).patchValue({
      attribute_id:event.value
    });
    let valuesss= this.getValuesFromAttribute('value',event.value);
  }

  getValuesFromAttribute(key:string,value:number){
      let attrId = value;
      let values =[];
      if(attrId){
        let objFound = this.attributesData.find((item:any)=>item.id==attrId);
        if(objFound && objFound.id){
          values= objFound.values;
        }else{
          values= [];
        }
      }else{
        values = [];
      }
      return values;
  }

  async saveTreatmentCondition(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();

      formData.append('category', JSON.stringify(this.treatmentConditionForm.value));
      formData.append('image_url', this.selectedImageFile);

      if(this.modalEvent == 'ADD') {
        let create = await  this._tcAddEditModalService.addNewCategories(formData);
      } else if (this.modalEvent == 'EDIT') {
        let update = await  this._tcAddEditModalService.editCategories(this.treatmentConditionForm.value.id,formData);
      }

      this.onEventCompleted.emit(true);
      this.closeModal();
      this.treatmentConditionForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.treatmentConditionForm);
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

  /*-----------------------------ATTRIBUTES --------------------------------*/
  addAttributeInput(){
    this.attributes().push(this.newAttributeInput());
    this.treatmentConditionForm.updateValueAndValidity();
  }

  newAttributeInput(): FormGroup{
    return new FormGroup({
      'attribute_id': new FormControl('', [Validators.required]),
      'values': new FormControl([], [Validators.required]),
    });
  }

  removeAttributeInput(empIndex:number){
    this.attributes().removeAt(empIndex);
  }

  attributes(): FormArray {
      return this.treatmentConditionForm.get("attributes") as FormArray
  }
  /*-----------------------------END OF ATTRIBUTES --------------------------------*/

  closeModal(){
    this._bsModalRef.hide();
  }
}
