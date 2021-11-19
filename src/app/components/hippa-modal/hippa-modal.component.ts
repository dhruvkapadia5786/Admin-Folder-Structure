import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { HippaModalService } from './hippa-modal.service';

@Component({
  selector: 'app-hippa-modal',
  templateUrl: './hippa-modal.component.html',
  styleUrls: ['./hippa-modal.component.scss']
})
export class HippaModalComponent implements OnInit {

  details:any;

  constructor(private _bsModalRef:BsModalRef,
    private _hippaModalService:HippaModalService) { }

  ngOnInit(): void {
     this.details= this._hippaModalService.getFormData();
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
