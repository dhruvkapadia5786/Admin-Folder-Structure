import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AuthService } from '../../services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/pharmacist/dashboard', title: 'Dashboard',  icon: 'fas fa-home', class: '' },
  { path: '/pharmacist/rx', title: 'Rx - Prescription',  icon:'fas fa-file-prescription', class: '' },
  { path: '/pharmacist/patient', title: 'Patient File',  icon:'fas fa-user-plus', class: '' },
  { path: '/pharmacist/prescriber', title: 'Prescriber',  icon:'fas fa-user-md', class: '' },
  { path: '/pharmacist/drug', title: 'Drug File',  icon:'fas fa-pills', class: '' },
  { path: '/pharmacist/insurance-plan', title: 'Insurance Plan File',  icon:'fas fa-clinic-medical', class: '' }
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})

export class SidebarComponent implements OnInit {

  public menuItems: any[]=[];
  public isCollapsed = true;
  navItems: any[]=[];

  constructor(private router: Router,private _authService:AuthService) {

  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  logoutUser(){
      this._authService.logout().then(()=>{
        this._authService.changeIsLogoutClicked(true);
        this._authService.clearStorage();
        this.router.navigate(['/account/login']);
      });
  }
}
