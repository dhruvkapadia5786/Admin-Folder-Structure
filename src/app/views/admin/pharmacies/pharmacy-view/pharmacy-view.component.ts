import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pharmacy-view',
  templateUrl: './pharmacy-view.component.html',
  styleUrls: ['./pharmacy-view.component.scss']
})
export class PharmacyViewComponent implements OnInit {

  hideNav:boolean=false;
  constructor(private _router:Router) {
    this.hideNav=this._router.url.includes('create-user');
  }

  ngOnInit() {
  } 

}
