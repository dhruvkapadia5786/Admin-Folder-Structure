import { Component, OnInit, ChangeDetectorRef,ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Toastr } from '../../../../services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Helper } from '../../../../services/helper.service';
import { State } from 'src/app/models/admin/State';

@Component({
  selector: 'app-bulk-create-coupon-code',
  templateUrl: './bulk-create-coupon-code.component.html',
  styleUrls: ['./bulk-create-coupon-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BulkCreateCouponCodeComponent implements OnInit {
  public divDiscountAmount = true;
  public divDiscountPercentage = false;
  public discount_type = '0';
  public questionObj: any = {};
  public statesList: State[] = [];
  public kitList:any[]=[];
  public digitalTherapyList:any[]=[];
  public healthKitList: any=[];
  public categoryList: any[] = [
    { 'name': 'Pharmacy Order', 'value': 'DRUG_ORDER'},
    { 'name': 'Order', 'value': 'ORDER'},
    { 'name': 'Digital Therapy Order', 'value': 'DIGITAL_THERAPY_ORDER'},
    { 'name': 'Consultation', 'value': 'CONSULTATION'}
  ]
  GrouponFile!:File;

  setDiscountValidators() {
    if (this.discount_type == '0') {
      this.divDiscountAmount = true;
      this.divDiscountPercentage = false
      this.addCouponCode.get('discount_percent')?.setValidators([]);
      this.addCouponCode.get('discount_percent')?.setValue(null);
      this.addCouponCode.get('discount_amount')?.setValidators([Validators.required]);
    } else {
      this.divDiscountAmount = false;
      this.divDiscountPercentage = true;
      this.addCouponCode.get('discount_percent')?.setValidators([Validators.required]);
      this.addCouponCode.get('discount_amount')?.setValidators([]);
      this.addCouponCode.get('discount_amount')?.setValue(null);
    }
    this.addCouponCode.get('discount_amount')?.updateValueAndValidity();
    this.addCouponCode.get('discount_percent')?.updateValueAndValidity();
  }

  public addCouponCode!: FormGroup;
  public couponCodeObj:any = {
    coupon_type:'REGULAR',
    coupon_code_file: null,
    coupon_name: 'GROUPON',
    discount_amount: null,
    discount_percent: null,
    use_count_sigle_user: 1,
    use_count_all_user: 1,
    start:null,
    expiry:null,
    is_used: false,
    is_active: true,
    coupon_code_id: null,
    states:[],
    kits:[],
    digital_therapies:[],
    health_conditions: [],
    coupon_category: ['ORDER']
  };

  constructor(private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _http: HttpClient,
    private _helper: Helper
  ) {

  }

  get coupon_type() { return this.addCouponCode.get('coupon_type'); }
  get coupon_code_file() { return this.addCouponCode.get('coupon_code_file'); }
  get coupon_name() { return this.addCouponCode.get('coupon_name'); }
  get discount_amount() { return this.addCouponCode.get('discount_amount'); }
  get discount_percent() { return this.addCouponCode.get('discount_percent'); }
  get use_count_sigle_user() { return this.addCouponCode.get('use_count_sigle_user'); }
  get use_count_all_user() { return this.addCouponCode.get('use_count_all_user'); }
  get start() { return this.addCouponCode.get('start'); }
  get expiry() { return this.addCouponCode.get('expiry'); }
  get is_used() { return this.addCouponCode.get('is_used'); }
  get disccount_type() { return this.addCouponCode.get('disccount_type'); }
  get is_active() { return this.addCouponCode.get('is_active'); }
  get states() { return this.addCouponCode.get('states'); }
  get kits() { return this.addCouponCode.get('kits'); }
  get digital_therapies(){return this.addCouponCode.get('digital_therapies');}
  get health_conditions() { return this.addCouponCode.get('health_conditions'); }
  get coupon_category() { return this.addCouponCode.get('coupon_category'); }

  ngOnInit() {
    this.getStateList();
    this.getMedicineKits();
    this.getHealthKits();
    this.addCouponCode = new FormGroup({
      'coupon_type': new FormControl(this.couponCodeObj.coupon_type, [Validators.required]),
      'coupon_code_file': new FormControl(this.couponCodeObj.coupon_code_file, [Validators.required]),
      'coupon_name': new FormControl('GROUPON', [Validators.required]),
      'discount_amount': new FormControl(this.couponCodeObj.discount_amount, [Validators.required]),
      'discount_percent': new FormControl(this.couponCodeObj.discount_percent),
      'use_count_sigle_user': new FormControl(this.couponCodeObj.use_count_sigle_user, [Validators.required]),
      'use_count_all_user': new FormControl(this.couponCodeObj.use_count_all_user, [Validators.required]),
      'start': new FormControl(this.couponCodeObj.start, [Validators.required]),
      'expiry': new FormControl(this.couponCodeObj.expiry, [Validators.required]),
      'is_used': new FormControl(this.couponCodeObj.is_used),
      'disccount_type': new FormControl(this.discount_type),
      'is_active': new FormControl(this.couponCodeObj.is_active),
      'states': new FormControl(this.couponCodeObj.states, [Validators.required]),
      'kits': new FormControl(this.couponCodeObj.kits, [Validators.required]),
      'digital_therapies': new FormControl(this.couponCodeObj.digital_therapies, [Validators.required]),
      'coupon_category': new FormControl(this.couponCodeObj.coupon_category, [Validators.required])
    });
  }

  get notSelectedStates () {
    return this.statesList.filter((data: any) => !this.couponCodeObj.states.some((b: any) => b === data.id)).length
  }

  get notSelectedKits () {
    return this.kitList.filter((data: any) => !this.couponCodeObj.kits.some((b: any) => b === data.id)).length
  }

  get notSelectedTherapies(){
    return this.digitalTherapyList.filter((data: any) => !this.couponCodeObj.digital_therapies.some((b: any) => b === data.id)).length
  }

  get notSelectedcategory () {
    return this.categoryList.filter((data: any) => !this.couponCodeObj.coupon_category.some((b: any) => b === data.value)).length
  }

  get notSelectedhealthKits () {
    return this.healthKitList.filter((data: any) => !this.couponCodeObj.health_conditions.some((b: any) => b === data.id)).length
  }

  public handleCheckAll (event:any, flag:any) {
    if (flag == 'state') {
      if (event.checked) {
        this.couponCodeObj.states = this.statesList.map(({id}) => id);
      } else {
        this.couponCodeObj.states = [];
      }
    } else if (flag == 'kit') {
      if (event.checked) {
        this.couponCodeObj.kits = this.kitList.map(({id}) => id);
      } else {
        this.couponCodeObj.kits = [];
      }
    }
    else if(flag=='therapy'){
      if(event.checked){
        this.couponCodeObj.digital_therapies = this.digitalTherapyList.map(({id})=>id);
      }else{
        this.couponCodeObj.digital_therapies=[];
      }
   }
    else if (flag == 'category') {
      if (event.checked) {
        this.couponCodeObj.coupon_category = this.categoryList.map(({value}) => value);
        this.addCouponCode.addControl('kits', new FormControl(this.couponCodeObj.kits, [Validators.required]));
        this.addCouponCode.addControl('digital_therapies', new FormControl(this.couponCodeObj.digital_therapies, [Validators.required]));
        this.addCouponCode.addControl('health_conditions', new FormControl(this.couponCodeObj.health_conditions, [Validators.required]));
        this._changeDetectorRef.detectChanges();
      } else {
        this.couponCodeObj.coupon_category = [];
        this.addCouponCode.removeControl('kits');
        this.couponCodeObj.kits=[];

        this.addCouponCode.removeControl('digital_therapies');
        this.couponCodeObj.digital_therapies=[];

        this.addCouponCode.removeControl('health_conditions');
        this.couponCodeObj.health_conditions=[];
        this._changeDetectorRef.detectChanges();
      }
    } else if (flag == 'health_conditions') {
      if (event.checked) {
        this.couponCodeObj.health_conditions = this.healthKitList.map((data: any) => data.id);
      } else {
        this.couponCodeObj.health_conditions = [];
      }
    }
  }

  public handleCategoryChange(event: any) {
    if (event.value.includes("ORDER")) {
      this.addCouponCode.addControl('kits', new FormControl(this.couponCodeObj.kits, [Validators.required]))
    } else {
      this.addCouponCode.removeControl('kits');
      this.couponCodeObj.kits=[];
    }

    if (event.value.includes("DIGITAL_THERAPY_ORDER")) {
      this.addCouponCode.addControl('digital_therapies', new FormControl(this.couponCodeObj.digital_therapies, [Validators.required]))
    } else {
      this.addCouponCode.removeControl('digital_therapies');
      this.couponCodeObj.digital_therapies=[];
    }

    if (event.value.includes("CONSULTATION")) {
      this.addCouponCode.addControl('health_conditions', new FormControl(this.couponCodeObj.health_conditions, [Validators.required]))
    } else {
      this.addCouponCode.removeControl('health_conditions');
      this.couponCodeObj.health_conditions=[];
    }
  }

  public getMedicineKits() {
     const url = 'api/medicinekits/id_name_price_active_list';
    this._http.get(url)
      .subscribe((medicineKitList: any) => {
          this.kitList= medicineKitList;
          this.handleCheckAll({checked:true},'kit');
      }, err => {

      });
  }

  public getHealthKits() {
    this._http.get('api/consultation/health_condition/active')
      .subscribe((data: any) => {
        this.healthKitList = data;
      }, err => {

      });
  }

  public getDigitalTherapies(){
    const url = 'api/digital-therapies/id_name_price_active_list';
    this._http.get(url).subscribe((therapies: any) => {
          this.digitalTherapyList= therapies;
      }, err => {

      });
  }


public getStateList() {
  this._http.get('api/states/active')
    .subscribe((data: any) => {
      this.statesList = data;
      this.handleCheckAll({checked:true},'state');
    }, err => {

    });
}

  onFileSelect(event:any){
    if (event.target.files.length > 0) {
      const file :File = event.target.files[0];
      this.GrouponFile = file;
    }
  }

  public saveCreateCouponCode(){
    if (this.addCouponCode.invalid) {
      this._helper.markFormGroupTouched(this.addCouponCode);
      return;
    }
    this.couponCodeObj.start = moment.tz(this.couponCodeObj.start, 'America/New_York').format('YYYY-MM-DD HH:mm:ss');
    this.couponCodeObj.expiry = moment.tz(this.couponCodeObj.expiry, 'America/New_York').format('YYYY-MM-DD HH:mm:ss');
    const url = 'api/coupan-code/bulkCreate';
    const fd: FormData = new FormData();
    fd.append('coupon_object', JSON.stringify(this.couponCodeObj));
    fd.append('coupon_code_file', this.GrouponFile);

    this._http.post(url,fd).subscribe((data: any) => {
      this._router.navigate(['/admin/coupon-code/list-coupon-code']);
      this._toastr.showSuccess('Save Successfully');
      this._changeDetectorRef.detectChanges();
    },
      err => {
        this._toastr.showError('Unable to save Coupon Code');
        this._changeDetectorRef.detectChanges();
      });
  }
}
