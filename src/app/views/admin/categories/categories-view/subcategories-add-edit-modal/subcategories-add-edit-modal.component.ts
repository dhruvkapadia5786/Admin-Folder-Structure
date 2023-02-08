import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { SubcategoriesAddEditModalService } from './subcategories-add-edit-modal.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subcategories-add-edit-modal',
  templateUrl: './subcategories-add-edit-modal.component.html',
  styleUrls: ['./subcategories-add-edit-modal.component.scss']
})
export class SubcategoriesAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  SubcategoryForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any
  attributesData:any[]=[];
  subcategoryDetails:any;

  constructor(
    private _http: HttpClient,
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: SubcategoriesAddEditModalService
  ) {
    this.SubcategoryForm = this.formBuilder.group({
      'category_id':new FormControl(null, []),
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'description': new FormControl(null, []),
      'image_url': new FormControl(null, []),
      'attributes':new FormArray([],[])
    });
  }

  get id() { return this.SubcategoryForm.get('id'); }
  get category_id() { return this.SubcategoryForm.get('category_id'); }
  get name() { return this.SubcategoryForm.get('name'); }
  get is_active() { return this.SubcategoryForm.get('is_active'); }
  get description() { return this.SubcategoryForm.get('description'); }
  get image_url() { return this.SubcategoryForm.get('image_url'); }

  ngOnInit(): void {
    this.getAllAttributesData();
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'ADD'){
      this.SubcategoryForm.patchValue({
        category_id:details.data.category_id
      });
    }
    if(details.event == 'EDIT'){
      this.getSubcategoryDetails(details.data.id);
    }
  }

  async saveOTCSubcategory(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();
      formData.append('subcategory', JSON.stringify(this.SubcategoryForm.value));
      formData.append('image_url', this.selectedImageFile);
      if(this.modalEvent == 'ADD'){
        let create = await  this._tcAddEditModalService.addNewSubcategories(formData);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._tcAddEditModalService.editSubcategories(this.SubcategoryForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.SubcategoryForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.SubcategoryForm);
    }
  }

  onFileChange(event:any, type: string){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (type == 'IMAGE'){
          this.imageUrl = reader.result;
          this.selectedImageFile = file;
        }
        this._changeDetectorRef.markForCheck();
      }
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

  getSubcategoryDetails(id:number){
    const url = 'api/admin/subcategories/view/'+id;
    this._http.get(url).subscribe((res: any) => {
      this.subcategoryDetails = res;
      this.patchFormValue();
    },(err) => {
      this.subcategoryDetails = null;
    });
  }

  patchFormValue(){
    this.SubcategoryForm.patchValue({
      id:this.subcategoryDetails.id,
      category_id:this.subcategoryDetails.category_id,
      name:this.subcategoryDetails.name,
      is_active:this.subcategoryDetails.is_active,
      description:this.subcategoryDetails.description
    });
    this.imageUrl = this.subcategoryDetails.image ? environment.api_url + this.subcategoryDetails.image : `../../../../../assets/img/no_preview.png`;
    const attributesControl = this.SubcategoryForm.get('attributes') as FormArray;
    if(this.subcategoryDetails.attributes){
      this.subcategoryDetails.attributes.forEach((item:any)=>{
        let attributeFormGroup = new FormGroup({
          'attribute_id':new FormControl(item.attribute_id, [Validators.required]),
          'values':new FormControl(item.values_ids, [Validators.required]),
        });
        attributesControl.push(attributeFormGroup);
      });
    }
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

  /*-----------------------------ATTRIBUTES --------------------------------*/
  addAttributeInput(){
    this.attributes().push(this.newAttributeInput());
    this.SubcategoryForm.updateValueAndValidity();
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
      return this.SubcategoryForm.get("attributes") as FormArray
  }
  /*-----------------------------END OF ATTRIBUTES --------------------------------*/

  closeModal(){
    this._bsModalRef.hide();
  }
}
