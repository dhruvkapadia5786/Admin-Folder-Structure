import { Injectable } from '@angular/core';
import { SYSTEM_STATUS } from 'src/app/enums/order-status.enum';
import { DOCTOR_STATUS } from 'src/app/enums/order-status.enum';
import { TECHNICIAN_STATUS } from 'src/app/enums/order-status.enum';
import { CUSTOMER_STATUS } from 'src/app/enums/order-status.enum';
import { PHARMACY_STATUS } from 'src/app/enums/order-status.enum';

@Injectable()
export class orderHelper {

	getSubscriptionStatus(data: string) {
		let subscriptionStatusBadge = '';
		switch (data) {
			case 'active':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill  badge-success'>Active</span>`;
				break;

			case 'completed':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill  badge-primary'>Completed</span>`;
				break;

			case 'cancelled':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill  badge-danger'>Cancelled</span>`;
				break;

			case 'refunded':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill badge-danger'>Refunded</span>`;
				break;

			case 'transferred':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill badge-warning'>Transferred</span>`;
				break;

			case 'account_disabled':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill badge-dark'>User Account Disabled</span>`;
				break;

			case 'closed':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill badge-dark'>Closed</span>`;
				break;

			case 'prescription_expired':
				subscriptionStatusBadge = `<span class='py-1 px-2 badge badge-pill badge-dark'>Prescription Expired</span>`;
				break;

			default:
				subscriptionStatusBadge = ``;
				break;
		}
		return subscriptionStatusBadge;
	}


	getSystemStatus(data: any) {
		let orderSystemStatus: any;
		switch (data) {
			case 0:
			case null:
				orderSystemStatus = `<span class='p-2 badge badge-pill badge-default'>Incomplete</span>`;
				break;
			case 1:
				orderSystemStatus = `<span class='p-2 badge badge-pill badge-info'>${SYSTEM_STATUS[data]}</span>`;
				break;
			case 2:
			case 4:
			case 5:
			case 6:
			case 9:
			case 10:
			case 11:
			case 17:
				orderSystemStatus = `<span class='p-2 badge badge-pill badge-success'>${SYSTEM_STATUS[data]}</span>`;
				break;
			case 3:
			case 13:
			case 14:
			case 15:
				orderSystemStatus = `<span class='p-2 badge badge-pill badge-danger'>${SYSTEM_STATUS[data]}</span>`;
				break;
			case 7:
			case 8:
			case 12:
			case 16:
				orderSystemStatus = `<span class='p-2 badge badge-pill badge-warning'>${SYSTEM_STATUS[data]}</span>`;
				break;
			default:
				orderSystemStatus = `<span>--</span>`;
				break;
		}
		return orderSystemStatus;
	}

	getDoctorStatus(data: number) {
		let orderDoctorStatus: any;
		switch (data) {
			case 1:
				orderDoctorStatus = `<span class='p-2 badge badge-pill badge-info'>${DOCTOR_STATUS[data]}</span>`;
				break;
			case 2:
			case 8:
			case 10:
				orderDoctorStatus = `<span class='p-2 badge badge-pill badge-success'>${DOCTOR_STATUS[data]}</span>`;
				break;
			case 4:
			case 7:
			case 9:
				orderDoctorStatus = `<span class='p-2 badge badge-pill badge-warning'>${DOCTOR_STATUS[data]}</span>`;
				break;
			case 5:
			case 6:
				orderDoctorStatus = `<span class='p-2 badge badge-pill badge-danger'>${DOCTOR_STATUS[data]}</span>`;
				break;
			default:
				orderDoctorStatus = `<span>--</span>`;
				break;
		}
		return orderDoctorStatus;
	}

	getTechnicianStatus(data: any) {
		let orderTechnicianStatus: any;
		switch (data) {
			case 1:
				orderTechnicianStatus = `<span class='p-2 badge badge-pill badge-info'>${TECHNICIAN_STATUS[data]}</span>`;
				break;
			case 2:
			case 8:
			case 10:
				orderTechnicianStatus = `<span class='p-2 badge badge-pill badge-success'>${TECHNICIAN_STATUS[data]}</span>`;
				break;
			case 4:
			case 7:
			case 9:
			case 11:
				orderTechnicianStatus = `<span class='p-2 badge badge-pill badge-warning'>${TECHNICIAN_STATUS[data]}</span>`;
				break;
			case 6:
				orderTechnicianStatus = `<span class='p-2 badge badge-pill badge-danger'>${TECHNICIAN_STATUS[data]}</span>`;
				break;
			default:
				orderTechnicianStatus = `<span>--</span>`;
				break;
		}
		return orderTechnicianStatus;
	}

	getCustomerStatus(data: any) {
		let orderCustomerStatus: any;
		switch (data) {
			case 1:
			case 2:
			case 5:
				orderCustomerStatus = `<span class='p-2 badge badge-pill badge-info'>${CUSTOMER_STATUS[data]}</span>`;
				break;
			case 6:
			case 4:
			case 9:
				orderCustomerStatus = `<span class='p-2 badge badge-pill badge-success'>${CUSTOMER_STATUS[data]}</span>`;
				break;
			case 3:
				orderCustomerStatus = `<span class='p-2 badge badge-pill badge-warning'>${CUSTOMER_STATUS[data]}</span>`;
				break;
			case 8:
				orderCustomerStatus = `<span class='p-2 badge badge-pill badge-danger'>${CUSTOMER_STATUS[data]}</span>`;
				break;
			default:
				orderCustomerStatus = `<span>--</span>`;
				break;
		}
		return orderCustomerStatus;
	}

	getPharmacyStatus(data: any) {
		let orderPharmacyStatus: any;
		switch (data) {
			case 1:
				orderPharmacyStatus = `<span class='p-2 badge badge-pill badge-info'>${PHARMACY_STATUS[data]}</span>`;
				break;
			case 3:
			case 4:
			case 7:
				orderPharmacyStatus = `<span class='p-2 badge badge-pill badge-success'>${PHARMACY_STATUS[data]}</span>`;
				break;
			case 2:
				orderPharmacyStatus = `<span class='p-2 badge badge-pill badge-warning'>${PHARMACY_STATUS[data]}</span>`;
				break;
			case 5:
			case 6:
				orderPharmacyStatus = `<span class='p-2 badge badge-pill badge-danger'>${PHARMACY_STATUS[data]}</span>`;
				break;
			default:
				orderPharmacyStatus = `<span>--</span>`;
				break;
		}
		return orderPharmacyStatus;
	}


	getOrderDrugStatus(status: string, user_type: number) {
		let badge = '';
		if (status == 'ORDER_PLACED') {
			badge = `<span class='badge badge-pill badge-info p-2'>ORDER PLACED</span>`;
		}
		else if (status == 'UNDER_REVIEW') {
			badge = `<span class='badge badge-pill badge-info p-2'>UNDER REVIEW</span>`;
		}
		else if (status == 'PRESCRIBED') {
			badge = `<span class='badge badge-pill badge-primary p-2'>PRESCRIBED BY DOCTOR</span>`;
		}
		else if (status == 'SHIPPED') {
			badge = `<span class='badge badge-pill badge-success p-2'>SHIPPED</span>`;
		}
		else if (status == 'PICKED_UP') {
			badge = `<span class='badge badge-pill badge-success p-2'>PICKED UP</span>`;
		}
		else if (status == 'REFUND_REQUESTED') {
			badge = user_type == 3 ? `<span class='badge badge-pill badge-dark p-2'>REFUNDED</span>` : `<span class='badge badge-pill badge-danger p-2'>REFUND REQUESTED</span>`;
		}
		else if (status == 'REFUND_PROCESSED') {
			badge = user_type == 3 ? `<span class='badge badge-pill badge-danger p-2'>REFUNDED</span>` : `<span class='badge badge-pill badge-danger p-2'>REFUND PROCESSED</span>`;
		}
		else if (status == 'COMPLETED') {
			badge = `<span class='badge badge-pill badge-success p-2'>COMPLETED</span>`;
		}
		else if (status == 'REJECTED') {
			badge = `<span class='badge badge-pill badge-danger p-2'>ORDER REJECTED</span>`;
		}
		else if (status == 'WAITING_FOR_PHARMACY_PROCESSING') {
			badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR PHARMACY PROCESSING</span>`;
		}
		else {
			badge = '<span></span>';
		}
		return badge;
	}

	getOrderType(data: any) {
		let badge = '';
		switch (data) {
			case null:
				badge = `<span class='badge badge-warning'>Default</span>`;
				break;
			case 'main':
				badge = `<span class='badge badge-danger'>Main</span>`;
				break;
			case 'refill':
				badge = `<span class='badge badge-primary'>Refill</span>`;
				break;
			default:
				badge = '';
				break;
		}
		return badge;
	}

	getOrderCreatedWay(data: any) {
		let badge = '';
		switch (data) {
			case 'MANUAL_BY_USER':
				badge = `<span class='badge badge-info'>Manually By Customer</span>`;
				break;
			case 'MANUAL_BY_STAFF':
				badge = `<span class='badge badge-warning'>Manually By Staff</span>`;
				break;
			case 'AUTO_BY_SYSTEM':
				badge = `<span class='badge badge-dark'>Auto By System</span>`;
				break;
		}
		return badge;
	}


}
