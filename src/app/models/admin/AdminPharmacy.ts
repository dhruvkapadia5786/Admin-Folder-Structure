export interface AdminPharmacyDetails {
    dea_number: string;
    pharmacy_type:string;
    professional_liability_document: string;
    professional_liability_policy_expiry: string;
    professional_liability_policy_number: string;
    fax_number: string;
    id: number;
    is_active: boolean;
    licenses: Array<AdminLicense>;
    npi_number: string;
    pharmacy_name: string;
    phone_number: string;
    practice_addresses: Array<AdminAddress>;
    llc_name: string;
    check_payable_to_name: string;
    is_default_pharmacy?:number;
    is_in_weno?:number;
    ncpdp:any;
}

export interface AdminAddress {
    id?: number;
    address_line1: string;
    addressLine1: string;
    address_line2?: string;
    addressLine2?: string;
    city_name: string;
    cityName: string;
    state_id?: number;
    state_name?: string;
    state: { id: number, name: string };
    zipcode: string;
    is_active: boolean;
    isActive: boolean;
}

export interface AdminLicense {
    id?: number;
    license_number: string;
    expiry_date: string;
    state_id?: number;
    state_name?: string;
    is_active: boolean;
    state: { id: number, name: string };
}
