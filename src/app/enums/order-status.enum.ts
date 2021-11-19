export enum SYSTEM_STATUS {
    '',
    'Order Placed',
    'Assigned to Technician',
    'Rejected by Technician',
    'Approved by Technician',
    'Assigned by Doctor',
    'Prescribed by Doctor',
    'On Hold in Doctor Queue',
    'Consultation Required',
    'Assigned to Pharmacy',
    'Shipped',
    'Delivered',
    'Concern',
    'Closed',
    'Cancelled',
    'Refunded',
    'Too Soon',
    'Pickup/Delivery'

}

export enum CUSTOMER_STATUS {
    '',
    'Order Placed',
    'Under Review',
    'Action Needed',
    'Shipped',
    'Prescribed',
    'Delivered',
    'Cancelled',
    'Refunded',
    'Pickup/Delivery'
}

export enum TECHNICIAN_STATUS {
    '',
    'Received',
    'Approved',
    'On Hold',
    'Rejected',
    'Cancelled',
    'Refunded',
    'Consent Sent',
    'Consent Received',
    'Approved/Consent Sent',
    'Approved/Consent Received',
    'Too Soon'
}

export enum DOCTOR_STATUS {
    '',
    'Received',
    'Prescribed',
    'On Hold',
    'Consultation Required',
    'Cancelled',
    'Refunded',
    'Consent Sent',
    'Consent Received',
    'Approved/Consent Sent',
    'Approved/Consent Received'
}

export enum PHARMACY_STATUS {
    '',
    'Received',
    'Printed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded',
    'Pickup/Delivery'
}

export enum SCHEDULE_STATUS {
    '',
    'Active',
    'Inactive',
    'Rejected',
    'Completed',
}

export enum CUSTOMER_SCHEDULE_STATUS {
    '',
    'Received',
    'Scheduled',
    'Cancelled',
    'Completed',
}

export enum DOCTOR_SCHEDULE_STATUS {
    '',
    'Received',
    'Scheduled',
    'Cancelled',
    'Completed',
}
