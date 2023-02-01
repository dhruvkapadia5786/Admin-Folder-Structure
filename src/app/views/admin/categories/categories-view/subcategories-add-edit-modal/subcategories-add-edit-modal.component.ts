import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { SubcategoriesAddEditModalService } from './subcategories-add-edit-modal.service';
import { environment } from 'src/environments/environment';

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

  constructor(
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
      'image_url': new FormControl(null, [])
    });
  }

  get id() { return this.SubcategoryForm.get('id'); }
  get category_id() { return this.SubcategoryForm.get('category_id'); }
  get name() { return this.SubcategoryForm.get('name'); }
  get is_active() { return this.SubcategoryForm.get('is_active'); }
  get description() { return this.SubcategoryForm.get('description'); }
  get image_url() { return this.SubcategoryForm.get('image_url'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'ADD'){
      this.SubcategoryForm.patchValue({
        category_id:details.data.category_id
      });
    }
    if(details.event == 'EDIT'){
      this.SubcategoryForm.patchValue({
        id:details.data.id,
        category_id:details.data.category_id,
        name:details.data.name,
        is_active:details.data.is_active,
        description:details.data.description
      });
      this.imageUrl = details.data.image_url ? environment.api_url + details.data.image_url : `../../../../../assets/img/no_preview.png`;
    }
  }


 

  async saveOTCSubcategory(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();
      formData.append('subcategory', JSON.stringify(this.SubcategoryForm.value));
      formData.append('image_url', this.selectedImageFile);

      if(this.modalEvent == 'ADD') {
        let create = await  this._tcAddEditModalService.addNewSubcategories(formData);
      } else if (this.modalEvent == 'EDIT') {
        let update = await  this._tcAddEditModalService.editSubcategories(this.SubcategoryForm.value.id,formData);
      }

      this.onEventCompleted.emit(true);
      this.closeModal();
      this.SubcategoryForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.SubcategoryForm);
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
