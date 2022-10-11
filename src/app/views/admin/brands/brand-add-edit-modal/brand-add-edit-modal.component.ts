import { ChangeDetectorRef, EventEmitter, Component, OnInit, Output, OnDestroy } from '@angular/core';
import { BrandAddEditModalService } from './brand-add-edit-modal.service';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { environment } from 'src/environments/environment';
import { Helper } from 'src/app/services/helper.service';

import { ReplaySubject, Subject } from 'rxjs';
import {tap, filter, takeUntil, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-brand-add-edit-modal',
  templateUrl: './brand-add-edit-modal.component.html',
  styleUrls: ['./brand-add-edit-modal.component.scss']
})
export class BrandAddEditModalComponent implements OnInit, OnDestroy {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  brandForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  coverImageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedCoverImageFile: any


  protected manufacturers: any[] = [];
  public manufacturerCtrl: FormControl = new FormControl();
  public manufacturerFilteringCtrl: FormControl = new FormControl();
  public searching = false;
  public filteredManufacturers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

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
      'is_active': new FormControl(true, []),
      'is_featured': new FormControl(null, [])
    });
  }

  get id() { return this.brandForm.get('id'); }
  get name() { return this.brandForm.get('name'); }
  get description() { return this.brandForm.get('description'); }
  get image_url() { return this.brandForm.get('image_url'); }
  get cover_image_url() { return this.brandForm.get('cover_image_url'); }
  get is_active() { return this.brandForm.get('is_active'); }
  get is_featured() { return this.brandForm.get('is_featured'); }

  ngOnInit(): void {

    this.manufacturerFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        switchMap((search:any) => {
          return this.filterManufacturesResults(search);
        }),
        takeUntil(this._onDestroy)
      )
      .subscribe((filteredBanks:any) => {
        this.searching = false;
        this.filteredManufacturers.next(filteredBanks);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

    let details = this._brandAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.brandForm.patchValue({
        id:details.data.id,
        name:details.data.name,
        description:details.data.description,
        is_active:details.data.is_active,
        is_featured:details.is_featured,
        manufacturer_id:details.manufacturer_id ? details.manufacturer_id.id:null
      });
      this.imageUrl = details.data.image_url ? environment.api_url + details.data.image_url : `../../../../../assets/img/no_preview.png`;
      this.coverImageUrl = details.data.cover_image_url ? environment.api_url + details.data.cover_image_url : `../../../../../assets/img/no_preview.png`;
      if(details.data.manufacturer_id){
        this.filteredManufacturers.next([details.data.manufacturer_id]);
      }
    }


  }

  async filterManufacturesResults(token: string) {
    return this._brandAddEditModalService.getAllManufacturers(token).then((data:any)=>{
      return data;
    });
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async saveBrand(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();
      let formVal = this.brandForm.value;
      formVal.manufacturer_id = this.manufacturerCtrl.value;
      formData.append('brand',JSON.stringify(formVal));
      formData.append('logo', this.selectedImageFile);
      formData.append('cover_image', this.selectedCoverImageFile);

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
