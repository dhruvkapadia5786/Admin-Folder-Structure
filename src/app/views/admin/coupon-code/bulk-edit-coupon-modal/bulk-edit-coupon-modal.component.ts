import { EventEmitter, Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';


@Component({
  selector: 'app-bulk-edit-coupon-modal',
  templateUrl: './bulk-edit-coupon-modal.component.html',
  styleUrls: ['./bulk-edit-coupon-modal.component.scss']
})
export class BulkEditCouponModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  public bulkUpdateCouponCode!: FormGroup;
  
  public divDiscountAmount = true;
  public divDiscountPercentage = false;
  public discount_type = '0';
  public is_change_amount_flag = false;

  constructor(
    public _helper: Helper,
    private _bsModalRef:BsModalRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }

  get expiry() { return this.bulkUpdateCouponCode.get('expiry'); }
  get is_change_amount() { return this. bulkUpdateCouponCode.get('is_change_amount'); }
  get disccount_type() { return this.bulkUpdateCouponCode.get('disccount_type'); }
  get discount_amount() { return this.bulkUpdateCouponCode.get('discount_amount'); }
  get discount_percent() { return this.bulkUpdateCouponCode.get('discount_percent'); }
  get is_active() { return this.bulkUpdateCouponCode.get('is_active'); }

  ngOnInit(): void {
    this.bulkUpdateCouponCode = new FormGroup({
      'expiry': new FormControl(null, [Validators.required]),
      'is_change_amount': new FormControl(false),
      'disccount_type': new FormControl(this.discount_type),
      'discount_amount': new FormControl(null),
      'discount_percent': new FormControl(null),
      'is_active': new FormControl(true)
    });
    this.setDiscountValidators();
  }

  updateCouponCode() {
    if (this.bulkUpdateCouponCode.invalid) {
      this._helper.markFormGroupTouched(this.bulkUpdateCouponCode);
      return;
    }

    this.onEventCompleted.emit(this.bulkUpdateCouponCode.value);
    this.closeModal();
  }


  resetFormWithDefaultValue() {
    this.bulkUpdateCouponCode.reset({
      expiry: null,
      is_change_amount: false,
      disccount_type: this.discount_type,
      discount_amount: null,
      discount_percent: null,
      is_active: true
    });
  }

  setDiscountValidators() {
    if (this.discount_type == '0' && this.is_change_amount_flag) {
      this.divDiscountAmount = true;
      this.divDiscountPercentage = false
      this.bulkUpdateCouponCode.get('discount_percent')?.setValidators([]);
      this.bulkUpdateCouponCode.get('discount_percent')?.setValue(null);
      this.bulkUpdateCouponCode.get('discount_amount')?.setValidators([Validators.required]);
    } else if(this.discount_type == '1' && this.is_change_amount_flag) {
      this.divDiscountAmount = false;
      this.divDiscountPercentage = true;
      this.bulkUpdateCouponCode.get('discount_percent')?.setValidators([Validators.required]);
      this.bulkUpdateCouponCode.get('discount_amount')?.setValidators([]);
      this.bulkUpdateCouponCode.get('discount_amount')?.setValue(null);
    } else {
      this.bulkUpdateCouponCode.get('discount_percent')?.setValidators([]);
      this.bulkUpdateCouponCode.get('discount_percent')?.setValue(null);

      this.bulkUpdateCouponCode.get('discount_amount')?.setValidators([]);
      this.bulkUpdateCouponCode.get('discount_amount')?.setValue(null);
    }
    this.bulkUpdateCouponCode.get('discount_amount')?.updateValueAndValidity();
    this.bulkUpdateCouponCode.get('discount_percent')?.updateValueAndValidity();
    this._changeDetectorRef.detectChanges();
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
