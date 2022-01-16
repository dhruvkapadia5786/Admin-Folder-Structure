import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bannerlink-modal',
  templateUrl: './bannerlink-modal.component.html',
  styleUrls: ['./bannerlink-modal.component.scss']
})
export class BannerlinkModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  modalType: any;
  modalTitle: any;

  constructor(
    private _bsModalRef:BsModalRef,
    private http: HttpClient){

  }


  ngOnInit(): void {

  }

  closeModal(){
    this._bsModalRef.hide()
  }

  _getState(){
    const url = 'api/system_states/all';
    this.http.get(url).subscribe((data:any) => {
    }, (err:any) => {});
  }

}
