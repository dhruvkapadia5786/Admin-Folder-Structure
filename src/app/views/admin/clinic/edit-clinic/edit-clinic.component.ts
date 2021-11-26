import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';
import { Router,ActivatedRoute } from '@angular/router';
import {ClinicService} from '../clinic.service';
import {AuthService} from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-clinic',
  templateUrl: './edit-clinic.component.html',
  styleUrls: ['./edit-clinic.component.scss']
})
export class EditClinicComponent implements OnInit {

  clinicId:any;
  clinicForm!: FormGroup;
  clinic:any;
  public doctorList: any;
  states:any[]=[];


  constructor(public _helper: Helper,
    private _toastr: Toastr,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _authService:AuthService,
    private _cdr:ChangeDetectorRef,
    private _http: HttpClient,
    private clinicService:ClinicService) {
       this.clinicId = this._activeRoute.snapshot.paramMap.get('id');
    }

    ngOnInit() {
      this.initializeForm();
      this.getStateList();
      this.loadDetails();
   }


   initializeForm(){
     this.clinicForm = new FormGroup({
       'clinic_name': new FormControl(null, [Validators.required]),
       'clinic_name_long_form': new FormControl(null, [Validators.required]),
       'address_line_1': new FormControl(null, [Validators.required]),
       'address_line_2': new FormControl(null, []),
       'city': new FormControl(null, [Validators.required]),
       'state': new FormControl(null,[Validators.required]),
       'zipcode': new FormControl(null,[Validators.required]),
       'primary_phone': new FormControl(null,[Validators.required]),
       'primary_fax': new FormControl(null,[]),
       'is_active':new FormControl(null,[]),
       'clinic_code': new FormControl(null,[Validators.required])
     });
   }

  get clinic_name() { return this.clinicForm.get('clinic_name'); }
  get clinic_name_long_form() { return this.clinicForm.get('clinic_name_long_form'); }
  get address_line_1() { return this.clinicForm.get('address_line_1'); }
  get address_line_2() { return this.clinicForm.get('address_line_2'); }
  get city() { return this.clinicForm.get('city'); }
  get state() { return this.clinicForm.get('state'); }
  get zipcode(){ return this.clinicForm.get('zipcode');}
  get primary_phone(){ return this.clinicForm.get('primary_phone');}
  get primary_fax(){ return this.clinicForm.get('primary_fax');}
  get is_active(){return this.clinicForm.get('is_active');}
  get clinic_code(){return this.clinicForm.get('clinic_code');}

  async loadDetails(){
    let details:any = await this.clinicService.viewClinic(this.clinicId).catch((e:any)=>e);
    if(details){
      this.clinic= details;
      this.clinicForm.patchValue({
        'clinic_name':details.clinic_name,
        'clinic_name_long_form':details.clinic_name_long_form,
        'address_line_1':details.address_line_1,
        'address_line_2':details.address_line_2,
        'city':details.city,
        'state': details.state,
        'zipcode': details.zipcode,
        'primary_phone': details.primary_phone,
        'primary_fax': details.primary_fax?details.primary_fax:'',
        'is_active':details.is_active,
        'clinic_code':details.clinic_code
     });
    }
  }

  async updateClinic(isvalid: boolean): Promise<boolean|void> {

    if (this.clinicForm.invalid) {
			this._helper.markFormGroupTouched(this.clinicForm);
			window.scrollTo(0, 0);
			return false;
		}
	  if(isvalid){
        let formSubmitted:any = await this.clinicService.updateClinic(this.clinicId,this.clinicForm.value).catch((e:any)=>e);
        if(formSubmitted && formSubmitted.modifiedCount>0){
          this._toastr.showSuccess('Clinic updated');
          this._router.navigate(['admin','clinic','list']);
        }else{
          this._toastr.showError('Error occurred , while updating clinic.');
        }
    }
  }



public getStateList() {
  this._http.get('api/system_states/all')
    .subscribe((data: any) => {
      this.states = data;
    }, err => {

    });
}



}
