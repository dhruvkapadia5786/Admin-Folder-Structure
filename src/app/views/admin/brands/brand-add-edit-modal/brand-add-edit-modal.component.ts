import { ChangeDetectorRef, EventEmitter, Component, OnInit, Output } from '@angular/core';
import { BrandAddEditModalService } from './brand-add-edit-modal.service';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-brand-add-edit-modal',
  templateUrl: './brand-add-edit-modal.component.html',
  styleUrls: ['./brand-add-edit-modal.component.scss']
})
export class BrandAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  brandForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  coverImageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedCoverImageFile: any

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _brandAddEditModalService: BrandAddEditModalService
  ) {
    this.brandForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, []),
      'image_url': new FormControl(null, []),
      'cover_image_url': new FormControl(null, []),
      'is_active': new FormControl(true, [])
    });
  }

  get id() { return this.brandForm.get('id'); }
  get name() { return this.brandForm.get('name'); }
  get description() { return this.brandForm.get('description'); }
  get image_url() { return this.brandForm.get('image_url'); }
  get cover_image_url() { return this.brandForm.get('cover_image_url'); }
  get is_active() { return this.brandForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._brandAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.brandForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        description:details.data.description,
        is_active:details.data.is_active
      });
      this.imageUrl = details.data.image_url ? environment.api_url + details.data.image_url : `../../../../../assets/img/no_preview.png`;
      this.coverImageUrl = details.data.cover_image_url ? environment.api_url + details.data.cover_image_url : `../../../../../assets/img/no_preview.png`;
    }
  }

  async saveBrand(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();
      formData.append('name', this.brandForm.value.name);
      formData.append('description', this.brandForm.value.description);
      formData.append('logo', this.selectedImageFile);
      formData.append('cover_image', this.selectedCoverImageFile);
      formData.append('is_active', this.brandForm.value.is_active);

      if(this.modalEvent == 'ADD') {
        let create = await  this._brandAddEditModalService.addNewBrand(formData);
      } else if (this.modalEvent == 'EDIT') {
        let update = await  this._brandAddEditModalService.editBrand(this.brandForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal()
      this.brandForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.brandForm);
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
        } else if (type == 'COVER') {
          this.coverImageUrl = reader.result;
          this.selectedCoverImageFile = file;
        }
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
