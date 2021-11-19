import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { TelemedicineModalService } from './telemedicine-modal.service';

@Component({
  selector: 'app-telemedicine-modal',
  templateUrl: './telemedicine-modal.component.html',
  styleUrls: ['./telemedicine-modal.component.scss']
})
export class TelemedicineModalComponent implements OnInit {

  details:any;
  constructor(private _bsModalRef:BsModalRef,
    private _telemedicineModalService:TelemedicineModalService) { }

  ngOnInit(): void {
      this.details  = this._telemedicineModalService.getFormData();
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
