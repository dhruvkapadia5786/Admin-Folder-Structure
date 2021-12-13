import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-confirm-delete-coupon-modal',
  templateUrl: './confirm-delete-coupon-modal.component.html',
  styleUrls: ['./confirm-delete-coupon-modal.component.scss']
})
export class ConfirmDeleteCouponModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  constructor(
    private _bsModalRef:BsModalRef
  ) { }

  ngOnInit(): void {
  }

  deleteSelectedCouponCode() {
    this.onEventCompleted.emit('DELETE');
    this.closeModal()
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
