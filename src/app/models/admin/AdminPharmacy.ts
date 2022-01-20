export interface AdminPharmacyDetails {
    pharmacy_type:string;
    fax_number: string;
    _id: any;
    is_active: boolean;
    licenses: Array<AdminLicense>;
    pharmacy_name: string;
    phone_number: string;
    practice_addresses: Array<AdminAddress>;
    llc_name: string;
    check_payable_to_name: string;
    is_default_pharmacy?:number;
    other_details:any[];
}

export interface AdminAddress {
    any?: number;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_id?: any;
    state?: any;
    zipcode: string;
    is_active: boolean;
    isActive: boolean;
}

export interface AdminLicense {
    _id?: any;
    license_number: string;
    expiry_date: string;
    state_id?: any;
    is_active: boolean;
    state:any
}
