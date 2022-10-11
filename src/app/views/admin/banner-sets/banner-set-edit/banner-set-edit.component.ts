import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { BannerlinkModalService } from '../bannerlink-modal/bannerlink-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BannerlinkModalComponent } from '../bannerlink-modal/bannerlink-modal.component';

@Component({
  selector: 'app-banner-set-edit',
  templateUrl: './banner-set-edit.component.html',
  styleUrls: ['./banner-set-edit.component.scss']
})
export class BannerSetEditComponent implements OnInit {

  bannerSetForm!: FormGroup;
  selectedFiles:File[]=[];
  setTypes=['HOME','MEDICINE','HEALTH_CARE_PRODUCTS'];
  landingTypes=['PRODUCT','OTC_CATEGORY','BRAND','DIRECT_LINK'];

  bannersetId: any;
  bannerSetDetails:any;

  modalRef!:BsModalRef

  constructor(public _helper: Helper,
      private _toastr: Toastr,
      private _router: Router,
      private _activeRoute: ActivatedRoute,
      private _bannerLinkModalService:BannerlinkModalService,
      private _bsModalService:BsModalService,
      private _changeDetectorRef:ChangeDetectorRef,
      private _http: HttpClient){

        this.bannersetId = this._activeRoute.snapshot.paramMap.get('id');

  }

  ngOnInit(): void{
    this.initializeForm();
    this.getBannerSetDetails();
  }

  public getBannerSetDetails(){
    this._http.get('api/bannersets/view/'+this.bannersetId).subscribe((data: any) => {
        this.bannerSetDetails = data;

        this.bannerSetForm.patchValue({
          set_type:data.set_type,
          is_active:data.is_active
        });

        const imagesControl = this.bannerSetForm.get('images') as FormArray;
        this.bannerSetDetails.banners.forEach((banner:any) => {

          let pId = banner.product_id ? banner.product_id.id:null;
          let bId =  banner.brand_id ? banner.brand_id.id:null;
          let cId =  banner.otc_category_id ? banner.otc_category_id.id:null;

          const lControl = new FormGroup({
            'image_src':new FormControl(banner.image_url,[]),
            'image': new FormControl(null, []),
            'caption': new FormControl(banner.caption, []),
            'landing_type':new FormControl(banner.landing_type, [Validators.required]),
            'direct_link':new FormControl(banner.direct_link, []),
            'product_id':new FormControl(pId, []),
            'brand_id':new FormControl(bId, []),
            'otc_category_id':new FormControl(cId, [])
          });
          imagesControl.push(lControl);
        });
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  initializeForm(){
    this.bannerSetForm = new FormGroup({
        set_type: new FormControl('', [Validators.required]),
        images:new FormArray([]),
        is_active:new FormControl(null, [])
    });
  }

  get is_active(){return this.bannerSetForm.get('is_active'); }
  get set_type(){return this.bannerSetForm.get('set_type'); }
  /*----------------------------- IMAGES ------------------------------------*/
  addFileInput(){
    this.images().push(this.newFileInput());
  }

  newFileInput(): FormGroup {
      return new FormGroup({
        'image_src': new FormControl('', []),
        'image': new FormControl('', []),
        'caption': new FormControl('', []),
        'landing_type':new FormControl('', [Validators.required]),
        'direct_link':new FormControl('', []),
        'product_id':new FormControl('', []),
        'brand_id':new FormControl('', []),
        'otc_category_id':new FormControl('', [])
      });
  }

  removeFileInput(empIndex:number){
      this.images().removeAt(empIndex);
      this.selectedFiles.splice(empIndex,1);
  }

  images(): FormArray {
    return this.bannerSetForm.get("images") as FormArray
  }

  patchValueAtIndex(index:number,value:any){
      this.images().at(index).patchValue(value);
  }

  onFileChange(index:number,event:any){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      const [file] = event.target.files;
      this.selectedFiles[index]=file;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // need to run CD since file load runs outside of zone
        this._changeDetectorRef.markForCheck();
      };
    }
  }

  async addBannerSet(isvalid: boolean): Promise<any>{
    if (this.bannerSetForm.invalid){
			this._helper.markFormGroupTouched(this.bannerSetForm);
			window.scrollTo(0, 0);
			return false;
		}
	  if(isvalid){
        const fd: FormData = new FormData();
        let bannersetVal = this.bannerSetForm.value;
        bannersetVal.oldImages = this.bannerSetDetails.banners;

        fd.append('bannerset', JSON.stringify(bannersetVal));
        if(this.selectedFiles.length>0){
          for(let file of this.selectedFiles){
            fd.append('images', file, file.name);
          }
        }
        let formSubmitted:any = await this.addBannerSetCallApi(fd).catch((e:any)=>e);
        if(formSubmitted && formSubmitted.id){
          this._toastr.showSuccess('BannerSet Updated');
          this._router.navigate(['admin','bannersets','list']);
        }else{
          this._toastr.showError('Error occurred , while creating bannerset.');
        }
    }
  }

  async addBannerSetCallApi(formValue:any){
    return await this._http.post(`api/bannersets/update/${this.bannersetId}`,formValue).toPromise();
  }

  onLandingTypeChange(index:number,event:any){
      let value=event.target.value;
      let otc_category_id_control =  this.images().at(index).get('otc_category_id');
      let product_id_control =  this.images().at(index).get('product_id');
      let brand_id_control =  this.images().at(index).get('brand_id');
      let direct_link_control =  this.images().at(index).get('direct_link');

      if(value=='OTC_CATEGORY'){
        otc_category_id_control ? otc_category_id_control.setValidators([Validators.required]):'';
        product_id_control ? product_id_control.clearValidators():'';
        brand_id_control ? brand_id_control.clearValidators():'';
        direct_link_control ? direct_link_control.clearValidators():'';

        product_id_control ? product_id_control.setValue(''):'';
        brand_id_control ? brand_id_control.setValue(''):'';
        direct_link_control ? direct_link_control.setValue(''):'';

      }else if(value=='PRODUCT'){
        product_id_control ? product_id_control.setValidators([Validators.required]):'';
        brand_id_control ? brand_id_control.clearValidators():'';
        otc_category_id_control ? otc_category_id_control.clearValidators():'';
        direct_link_control ? direct_link_control.clearValidators():'';

        brand_id_control ? brand_id_control.setValue(''):'';
        otc_category_id_control ? otc_category_id_control.setValue(''):'';
        direct_link_control ? direct_link_control.setValue(''):'';

      }else if(value=='BRAND'){
        brand_id_control ? brand_id_control.setValidators([Validators.required]):'';
        product_id_control ? product_id_control.clearValidators():'';
        otc_category_id_control ? otc_category_id_control.clearValidators():'';
        direct_link_control ? direct_link_control.clearValidators():'';

        otc_category_id_control ? otc_category_id_control.setValue(''):'';
        product_id_control ? product_id_control.setValue(''):'';
        direct_link_control ? direct_link_control.setValue(''):'';


      }else{

        direct_link_control ? direct_link_control.setValidators([Validators.required]):'';
        brand_id_control ? brand_id_control.clearValidators():'';
        product_id_control ? product_id_control.clearValidators():'';
        otc_category_id_control ? otc_category_id_control.clearValidators():'';

        otc_category_id_control ? otc_category_id_control.setValue(''):'';
        product_id_control ? product_id_control.setValue(''):'';
        brand_id_control ? brand_id_control.setValue(''):'';

      }

      brand_id_control ? brand_id_control.updateValueAndValidity():'';
      product_id_control ? product_id_control.updateValueAndValidity():'';
      otc_category_id_control ? otc_category_id_control.updateValueAndValidity():'';
      direct_link_control ? direct_link_control.updateValueAndValidity():'';

  }

  openBannerLinkSearchModal(index:number,tab:any){
    this._bannerLinkModalService.setFormData({
      selectedTab:tab
    });
    this.modalRef = this._bsModalService.show(BannerlinkModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe((data:any)=>{
        if(tab=='OTC_CATEGORY'){
          this.patchValueAtIndex(index,{'otc_category_id':data.id});
        }else if(tab=='PRODUCT'){
          this.patchValueAtIndex(index,{'product_id':data.id});
        }else{
          this.patchValueAtIndex(index,{'brand_id':data.id});
        }
    });
  }

}
