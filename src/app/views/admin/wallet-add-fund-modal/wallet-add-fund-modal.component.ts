import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { WalletAddFundModalService } from './wallet-add-fund-modal.service';

@Component({
  selector: 'app-wallet-add-fund-modal',
  templateUrl: './wallet-add-fund-modal.component.html',
  styleUrls: ['./wallet-add-fund-modal.component.scss']
})
export class WalletAddFundModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
   addFundForm:FormGroup;
   selectedUser:any;

  constructor(
    private _http: HttpClient,
    private _toastr: Toastr,
    public _helper: Helper,
    private _bsModalRef:BsModalRef,
    private _walletAddFundModalService:WalletAddFundModalService,
    private _changeDetectorRef: ChangeDetectorRef){

   this.addFundForm= new FormGroup({
      customer_id:new FormControl(null,[Validators.required]),
      amount:new FormControl(null,[Validators.required]),
      description:new FormControl(null,[Validators.required]),
   });

  }

 get amount(){return this.addFundForm.get('amount');}
 get customer_id(){return this.addFundForm.get('customer_id');}
 get description(){return this.addFundForm.get('description');}

  ngOnInit(): void {
    this.selectedUser = this._walletAddFundModalService.getData();
    this.addFundForm.reset();
    this.addFundForm.patchValue({
       customer_id:this.selectedUser._id,
       amount:10,
       description:'Fund Deposited By Teledaddy System'
    });
  }

  addFundToWallet(formValid:boolean){
    if(formValid){
      const url = 'api/wallets/add_fund' ;
      const req = this.addFundForm.value;
      this._http.post(url, req).subscribe((data: any) => {
        this.selectedUser = null;
        this._toastr.showSuccess('Fund added to wallet Successfully');
        this.onEventCompleted.emit(true);
        this.addFundForm.reset();
        this.closeModal()
      },
      err => {
        this._toastr.showError('Unable to add Fund in wallet');
      });
    }else{
      this._helper.markFormGroupTouched(this.addFundForm);
      return ;
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
