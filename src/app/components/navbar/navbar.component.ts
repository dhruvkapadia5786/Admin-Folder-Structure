import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from "../../services/auth.service";
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { notificationHelper } from 'src/app/services/notificationHelper.service';
import { AppNotification } from 'src/app/models/Notification';
import * as moment from 'moment-timezone';
import { MsgService } from 'src/app/services/msgService';
import * as io from 'socket.io-client';
import { Subscription } from 'rxjs';

declare interface RouteInfo {
	path: string;
	title: string;
	icon: string;
	class: string;
}

export const ROUTES: RouteInfo[] = [
	{ path: '/admin/dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', class: '' },
];

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
	public userFullName: string = '';
	private userInfo: any;
	public focus: any;
	public listTitles: any[] = [];
	public location: Location;
	public menuItems: any[] = [];

	socket: any;
	public notifications: AppNotification[] = [];
	newNotificationCount: number = 0;
	hasNewNotifications: boolean = false;

	navItems: any[] = [];
	constructor(location: Location,
		private router: Router,
		private element: ElementRef,
		private http: HttpClient,
		private _authService: AuthService,
		private msgService: MsgService,
		public _notificationHelper: notificationHelper,
		private _changeDetectorRef: ChangeDetectorRef) {
		this.location = location;

		this.navItems = [
			{ route: '/admin/dashboard', iconName: 'fa-tachometer-alt', displayName: 'Dashboard' },
			{
				displayName: 'Doctors & Clinic',
				iconName: 'fa-user-md',
				children: [
					{ route: '/admin/doctors', iconName: 'fa-user-md', displayName: 'Doctors' },
					{ route: '/admin/clinic', iconName: 'fa-hospital-o', displayName: 'Clinics' },
					{ route: '/admin/account-request', iconName: 'fa-stethoscope', displayName: 'Account Request' },
					{ route: '/admin/doctor-registration-codes', iconName: 'fa-puzzle-piece', displayName: 'Doctors Registration Codes' }
				]
			},
			{ route: '/admin/patients', iconName: 'fa-users', displayName: 'Patients' },
			{
				displayName: 'Technician & Pharmacy',
				iconName: 'fa-id-badge',
				children: [
					{ route: '/admin/technicians', iconName: 'fa-id-badge', displayName: 'Technicians' },
					{ route: '/admin/pharmacies', iconName: 'fa-ambulance', displayName: 'Pharmacies' }
				]
			},
      {
				displayName: 'Manufacturers & Brands',
				iconName: 'fa-id-badge',
				children: [
            { route: '/admin/manufacturers', iconName: 'fa-list', displayName: 'Manufacturers' },
            { route: '/admin/brands', iconName: 'fa-list', displayName: 'Brands' }
          ]
      },
			{
				displayName: 'Contact Lenses',
				iconName: 'fa-eye',
				children: [
					{ route: '/admin/contactlenses-types', iconName: 'fa-bars', displayName: 'Lens Types' },
					{ route: '/admin/contactlenses-colors', iconName: 'fa-bars', displayName: 'Colors' },
					{ route: '/admin/contactlenses-brands', iconName: 'fa-bars', displayName: 'Brands' },
					{ route: '/admin/contactlenses-products', iconName: 'fa-medkit', displayName: 'Products' },
				]
			},
			{ route: '/admin/treatment-conditions', iconName: 'fa-medkit', displayName: 'Treatment Conditions' },
			{ route: '/admin/medicine-kits', iconName: 'fa-cubes', displayName: 'Medicine Kits' },
			{ route: '/admin/orders', iconName: 'fa-shopping-cart', displayName: 'Orders' },
      {
				displayName: 'Consultation',
				iconName: 'fa-user-md',
				children: [
					{ route: '/admin/consultation', iconName: 'fa-user-md', displayName: 'Consultation' },
					{ route: '/admin/consultation-health-conditions', iconName: 'fa-medkit', displayName: 'Health Conditions' },
					{ route: '/admin/consultation-questions', iconName: 'fa-question', displayName: 'Consultation Questions' }
				]
			},
			{
				displayName: 'Questions',
				iconName: 'fa-question',
				children: [
					{ route: '/admin/questions/questions-list', iconName: 'fa-question', displayName: 'Questions' },
					{ route: '/admin/questions/change-sequence', iconName: 'fa-sort', displayName: 'Questions Sequence' },
					{ route: '/admin/questions/preview', iconName: 'fa-eye', displayName: 'Questions Preview' }
				]
			},
			{
				displayName: 'OTC Drug',
				iconName: 'fa-medkit',
				children: [
					{ route: '/admin/otc-categories', iconName: 'fa-bars', displayName: 'OTC Categories' },
					{ route: '/admin/otc-drugs', iconName: 'fa-medkit', displayName: 'OTC Drugs' },
				]
			},
      { route: '/admin/products', iconName: 'fa-pills', displayName: 'Products' },
      { route: '/admin/reports', iconName: 'fa-file', displayName: 'Reports' },
      { route: '/admin/wallets', iconName: 'fa-rupee-sign', displayName: 'Wallets' },
			{
				displayName: 'Others',
				iconName: 'fa-info-circle',
				children: [
					{ route: '/admin/countries', iconName: 'fa-globe', displayName: 'Countries' },
					{ route: '/admin/states', iconName: 'fa-globe', displayName: 'States' },
					{ route: '/admin/comment-categories', iconName: 'fa-comments', displayName: 'Comment Categories' },
					{ route: '/admin/faq', iconName: 'fa-question-circle', displayName: 'FAQ' },
					{ route: '/admin/settings', iconName: 'fa-cog', displayName: 'Settings' }
				]
			}
		]
	}

	ngOnInit() {
		this.menuItems = ROUTES;
		this.userInfo = this._authService.getUser();
		if (this.userInfo && this.userInfo.firstName && this.userInfo.lastName) {
			this.userFullName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
		}

		const that = this;
		this.socket = io(environment.websocket_url);
		this.socket.on('appNotifications', () => {
			that.getNotifications();
		});
	}

	ngOnDestroy() {
	}

	logoutUser() {
		this._authService.logout().then(() => {
			this._authService.changeIsLogoutClicked(true);
			this._authService.clearStorage();
			this.dissconnectSocket();
			this.router.navigate(['/account/login']);
		});
	}

	dissconnectSocket() {
		this.msgService.dissconnectSocket();
	}

	getNotifications() {
		const url = 'api/v1/notifications/latest';
		this.http.get(url).subscribe((data: any) => {
			this.notifications = data;
			this.getNotificationsCount();
			this.converLinkToJSON(this.notifications);
			this._changeDetectorRef.detectChanges();
		}, (err: any) => {

		})
	}

	getNotificationsCount() {
		this.newNotificationCount = 0;
		this.hasNewNotifications = false;
		this.notifications.forEach(notification => {
			if (notification.status == 1) {
				this.newNotificationCount += 1;
				this.hasNewNotifications = true;
			}
		});
	}

	converLinkToJSON(notifications: any[]) {
		notifications.forEach((notify: any) => {
			if (notify.link !== '') {
				notify.link = JSON.parse(notify.link);
			} else {
				notify.link = '';
			}
		});
	}

	clickNotification(notification: any) {
		this._notificationHelper.clickNotification(this.userInfo, notification, this.router);
		this.getNotifications();
	}

	readNotification(notificationId: number) {
		let notificationIds = [];
		notificationIds.push(notificationId);
		this._notificationHelper.readNotification(notificationIds).then((data: any) => {
			this.getNotifications();
			this._changeDetectorRef.detectChanges();
		});
	}

	readAllNotification() {
		let allNotificationIds: any[] = [];
		this.notifications.forEach((notification: any) => {
			allNotificationIds.push(notification.id);
		});
		this._notificationHelper.readNotification(allNotificationIds).then((data: any) => {
			this.getNotifications();
			this._changeDetectorRef.detectChanges();
		});
	}

	getDateForNotification(date: any) {
		var startDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').tz('Asia/Calcutta');
		var endDate = moment.tz('Asia/Calcutta');
		var result = endDate.diff(startDate, 'days');
		return result <= 3 ? moment.tz(date, 'Asia/Calcutta').fromNow() : moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MM/DD/YYYY HH:mm:ss A');
	}

}
