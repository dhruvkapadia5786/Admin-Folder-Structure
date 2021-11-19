import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';
import { Router,ActivatedRoute } from '@angular/router';
import {ClinicService} from '../clinic.service';
import {AuthService} from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-clinic',
  templateUrl: './add-clinic.component.html',
  styleUrls: ['./add-clinic.component.scss']
})
export class AddClinicComponent implements OnInit {

  clinicForm!: FormGroup;
  states:any[]=[];

  constructor(public _helper: Helper,
    private _toastr: Toastr,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _authService:AuthService,
    private _cdr:ChangeDetectorRef,
    private _http: HttpClient,
    private clinicService:ClinicService) {
    }

  ngOnInit() {
    this.getStateList();
    this.initializeForm();
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
      'clinic_code':new FormControl(null,[Validators.required])
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

  async addClinic(isvalid: boolean): Promise<any> {
    if (this.clinicForm.invalid) {
			this._helper.markFormGroupTouched(this.clinicForm);
			window.scrollTo(0, 0);
			return false;
		}
	  if(isvalid){
        let formSubmitted:any = await this.clinicService.addClinic(this.clinicForm.value).catch((e:any)=>e);
        if(formSubmitted && formSubmitted._id){
          this._toastr.showSuccess('Clinic Created');
          this._router.navigate(['admin','clinic','list']);
        }else{
          this._toastr.showError('Error occurred , while creating clinic.');
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
