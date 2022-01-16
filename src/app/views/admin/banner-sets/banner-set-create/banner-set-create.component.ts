import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-banner-set-create',
  templateUrl: './banner-set-create.component.html',
  styleUrls: ['./banner-set-create.component.scss']
})
export class BannerSetCreateComponent implements OnInit {

  bannerSetForm!: FormGroup;
  selectedFiles:File[]=[];
  setTypes=['HOME','MEDICINE','HEALTH_CARE_PRODUCTS'];
  landingTypes=['PRODUCT','OTC_CATEGORY','BRAND','DIRECT_LINK'];

  constructor(public _helper: Helper,
      private _toastr: Toastr,
      private _router: Router,
      private _changeDetectorRef:ChangeDetectorRef,
      private _http: HttpClient){

  }

  ngOnInit(): void{
    this.initializeForm();
  }

  initializeForm(){
    this.bannerSetForm = new FormGroup({
        set_type: new FormControl('', [Validators.required]),
        images:new FormArray([])
    });
    this.addFileInput();
  }

  get set_type(){return this.bannerSetForm.get('set_type'); }
  /*----------------------------- IMAGES ------------------------------------*/
  addFileInput(){
    this.images().push(this.newFileInput());
  }

  newFileInput(): FormGroup {
      return new FormGroup({
        'image': new FormControl('', [Validators.required]),
        'caption': new FormControl('', []),
        'landing_type':new FormControl('', []),
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
        fd.append('bannerset', JSON.stringify(bannersetVal));
        if(this.selectedFiles.length>0){
          for(let file of this.selectedFiles){
            fd.append('images', file, file.name);
          }
        }
        let formSubmitted:any = await this.addBannerSetCallApi(fd).catch((e:any)=>e);
        if(formSubmitted && formSubmitted._id){
          this._toastr.showSuccess('BannerSet Created');
          this._router.navigate(['admin','bannersets','list']);
        }else{
          this._toastr.showError('Error occurred , while creating bannerset.');
        }
    }
  }

  async addBannerSetCallApi(formValue:any){
    return await this._http.post(`api/bannersets/create`,formValue).toPromise();
  }

  onLandingTypeChange(index:number,event:any){

  }

}
