import { Component, OnInit, ChangeDetectorRef,ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from 'src/app/models/admin/State';
import * as moment from 'moment';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-edit-coupon-code',
  templateUrl: './edit-coupon-code.component.html',
  styleUrls: ['./edit-coupon-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditCouponCodeComponent implements OnInit {
  public divDiscountAmount = false;
  public divDiscountPercentage = false;
  public isDiscountType = false;
  public isPercentageType = false;
  public discountType: any;
  public statesList: any[] = [];
  public kitList:any[]=[];
  public healthKitList: any=[];
  public categoryList: any = [
    { 'name': 'Pharmacy Order', 'value': 'PHARMACY_ORDER'},
    { 'name': 'Order', 'value': 'DTC_ORDER'},
    { 'name': 'Consultation', 'value': 'CONSULTATION'}
  ]
  public editCouponCode: FormGroup;

  setDiscountValidators(){
    let discount_percent_control = this.editCouponCode.get('discount_percent');
    let discount_amount_control = this.editCouponCode.get('discount_amount');
    if(this.discountType == 'AMOUNT'){
          this.divDiscountAmount = true;
          this.divDiscountPercentage = false
          if(discount_percent_control){
            discount_percent_control.setValidators([]);
            discount_percent_control.setValue(null);
          }
          discount_amount_control? discount_amount_control.setValidators([Validators.required]):'';
    } else {
        this.divDiscountAmount = false;
        this.divDiscountPercentage = true;
        if(discount_percent_control){
          discount_percent_control.setValidators([Validators.required]);
        }
        if(discount_amount_control){
          discount_amount_control.setValidators([]);
          discount_amount_control.setValue(null);
        }
    }
    discount_amount_control?discount_amount_control.updateValueAndValidity():'';
    discount_percent_control?discount_percent_control.updateValueAndValidity():'';
  }

  public couponCodeObj: any = {
    coupon_type:'REGULAR',
    coupon_code: null,
    coupon_name: null,
    discount_amount: null,
    discount_percent: null,
    use_count_single_user: null,
    use_count_all_user: null,
    start: null,
    expiry: null,
    is_used: false,
    is_active: true,
    coupon_code_id: null,
    states:[],
    kits:[],
    health_conditions: [],
    coupon_category: []
  };
  public couponCodeId: any;

  constructor(private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private _helper: Helper
  ) {
    this.editCouponCode = new FormGroup({
      'coupon_type': new FormControl(this.couponCodeObj.coupon_type, [Validators.required]),
      'coupon_code': new FormControl(this.couponCodeObj.coupon_code, [Validators.required]),
      'coupon_name': new FormControl(this.couponCodeObj.coupon_name, [Validators.required]),
      'discount_amount': new FormControl(this.couponCodeObj.discount_amount),
      'discount_percent': new FormControl(this.couponCodeObj.discount_percent),
      'use_count_single_user': new FormControl(this.couponCodeObj.use_count_single_user, [Validators.required]),
      'use_count_all_user': new FormControl(this.couponCodeObj.use_count_all_user, [Validators.required]),
      'start': new FormControl(this.couponCodeObj.start, [Validators.required]),
      'expiry': new FormControl(this.couponCodeObj.expiry, [Validators.required]),
      'is_used': new FormControl(this.couponCodeObj.is_used),
      'is_active': new FormControl(this.couponCodeObj.is_active),
      'discount_type': new FormControl(this.discountType),
      'states': new FormControl(this.couponCodeObj.states, [Validators.required]),
      'kits': new FormControl(this.couponCodeObj.kits, [Validators.required]),
      'health_conditions':new FormControl(this.couponCodeObj.health_conditions, [Validators.required]),
      'coupon_category': new FormControl(this.couponCodeObj.coupon_category, [Validators.required])
    });
  }

  get coupon_type() { return this.editCouponCode.get('coupon_type'); }
  get coupon_code() { return this.editCouponCode.get('coupon_code'); }
  get coupon_name() { return this.editCouponCode.get('coupon_name'); }
  get discount_amount() { return this.editCouponCode.get('discount_amount'); }
  get discount_percent() { return this.editCouponCode.get('discount_percent'); }
  get use_count_single_user() { return this.editCouponCode.get('use_count_single_user'); }
  get use_count_all_user() { return this.editCouponCode.get('use_count_all_user'); }
  get start() { return this.editCouponCode.get('start'); }
  get expiry() { return this.editCouponCode.get('expiry'); }
  get is_used() { return this.editCouponCode.get('is_used'); }
  get discount_type() { return this.editCouponCode.get('discount_type'); }
  get is_active() { return this.editCouponCode.get('is_active'); }
  get states() { return this.editCouponCode.get('states'); }
  get kits() { return this.editCouponCode.get('kits'); }
  get health_conditions() { return this.editCouponCode.get('health_conditions'); }
  get coupon_category() { return this.editCouponCode.get('coupon_category'); }


  ngOnInit() {
    this.getStateList();
    this.getMedicineKits();
    this.getHealthKits();
    this.couponCodeId = this.route.snapshot.paramMap.get('id');
    this.getCouponCode();
  }
  public getCouponCode() {
    const url = 'api/coupon_codes/view/' + this.couponCodeId;
    this._http.get(url)
      .subscribe((data: any) => {
        this.couponCodeObj = data;
        this.couponCodeObj.kits=this.couponCodeObj.dtc_medicine_kits.map((kit: any)=>kit._id);
        this.couponCodeObj.health_conditions= this.couponCodeObj.consultation_health_conditions ? this.couponCodeObj.consultation_health_conditions.map((kit: any)=>kit._id) : [];

        this.couponCodeObj.states=this.couponCodeObj.states.map((state: any)=>state._id);
        this.couponCodeObj.coupon_category= this.couponCodeObj.coupon_category ? this.couponCodeObj.coupon_category : [];

        this.handleCategoryChange({value: this.couponCodeObj.coupon_category})

        this.couponCodeObj.coupon_code_id = data._id;
        if (this.couponCodeObj.discount_amount != 0) {
          this.divDiscountAmount = true;
          this.discountType = 'AMOUNT';
          this.isDiscountType = true;
        } else {
          this.discountType = 'PERCENTAGE';
          this.divDiscountPercentage = true;
          this.isPercentageType = true;
        }
        this.setDiscountValidators();
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

      get notSelectedStates () {
        return this.statesList.filter(({ _id: a }) => !this.couponCodeObj.states.some((b: any) => b === a)).length
      }

      get notSelectedKits () {
        return this.kitList.filter(({ _id: a }) => !this.couponCodeObj.kits.some((b: any) => b === a)).length
      }
      get notSelectedCategory () {
        return this.categoryList.filter((item:any)=> !this.couponCodeObj.coupon_category.some((b: any) => b === item.value)).length
      }

      get notSelectedhealthKits () {
        return this.healthKitList.filter((data: any) => !this.couponCodeObj.health_conditions.some((b: any) => b === data._id)).length
      }

      public handleCheckAll (event: any, flag: any) {
        if (flag == 'state') {
          if (event.checked) {
            this.couponCodeObj.states = this.statesList.map(({_id}) => _id);
          } else {
            this.couponCodeObj.states = [];
          }
        } else if (flag == 'kit') {
          if (event.checked) {
            this.couponCodeObj.kits = this.kitList.map(({_id}) => _id);
          } else {
            this.couponCodeObj.kits = [];
          }
      } else if (flag == 'category') {
        if (event.checked) {
          this.couponCodeObj.coupon_category = this.categoryList.map((item:any) => item.value);
          this.editCouponCode.addControl('kits', new FormControl(this.couponCodeObj.kits, [Validators.required]));
          this.editCouponCode.addControl('health_conditions', new FormControl(this.couponCodeObj.health_conditions, [Validators.required]));
          this._changeDetectorRef.detectChanges();
        } else {
          this.couponCodeObj.coupon_category = [];
          this.editCouponCode.removeControl('kits');
          this.couponCodeObj.kits=[];
          this.editCouponCode.removeControl('health_conditions');
          this.couponCodeObj.health_conditions=[];
          this._changeDetectorRef.detectChanges();
        }
      } else if (flag == 'health_conditions') {
        if (event.checked) {
          this.couponCodeObj.health_conditions = this.healthKitList.map((data: any) => data._id);
        } else {
          this.couponCodeObj.health_conditions = [];
        }
      }
    }

  public handleCategoryChange(event: any) {
      if (event.value.includes("DTC_ORDER")) {
        this.editCouponCode.addControl('kits', new FormControl(this.couponCodeObj.kits, [Validators.required]))
      } else {
        this.editCouponCode.removeControl('kits');
        this.couponCodeObj.kits=[];
      }
      if (event.value.includes("CONSULTATION")) {
        this.editCouponCode.addControl('health_conditions', new FormControl(this.couponCodeObj.consultation_health_conditions, [Validators.required]))
      } else {
        this.editCouponCode.removeControl('health_conditions');
        this.couponCodeObj.health_conditions=[];
      }
  }

  public getMedicineKits() {
     const url = 'api/medicine_kits/all';
     this._http.get(url).subscribe((medicineKitList: any) => {
          this.kitList= medicineKitList;
    }, err => {

    });
  }

  public getHealthKits(){
    this._http.get('api/consultation_health_conditions/all').subscribe((data: any) => {
        this.healthKitList = data;
      }, err => {

      });
  }

public getStateList() {
  this._http.get('api/system_states/all').subscribe((data: any) => {
      this.statesList = data;
    }, err => {

    });
}

  public saveCreateCouponCode(){
    if (this.editCouponCode.invalid){
      this._helper.markFormGroupTouched(this.editCouponCode);
      return;
    }
    this.couponCodeObj.start = moment.tz(this.couponCodeObj.start, 'Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
    this.couponCodeObj.expiry = moment.tz(this.couponCodeObj.expiry, 'Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
    const url = 'api/coupon_codes/update/' + this.couponCodeId;
    const req = this.couponCodeObj;
    this._http.post(url, req).subscribe((data: any) => {
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
