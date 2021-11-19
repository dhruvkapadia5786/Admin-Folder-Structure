export interface UserOrderConsents {
    attempt?: number;
    created?: string;
    hippa?: string;
    id?: number;
    order_id?: number;
    other?: string;
    privacy?: string;
    telemedicine?: string;
    terms?: string;
    updated?: string;
    user_id?: number;
}
export interface UserOrderDrugs {
    attempt: number;
    consent_message: string;
    consent_received_datetime: string;
    consent_sent_datetime: string;
    created: string;
    drug_name: string;
    id: number;
    order_id: number;
    rxcui: string;
    updated: string;
    user_id: number;
}

export interface UserOrderIllnesses {
    attempt?: number;
    consent_message?: string;
    consent_received_datetime?: string;
    consent_sent_datetime?: string;
    created?: string;
    id?: number;
    illnesses?: string;
    order_id?: number;
    updated?: string;
    user_id?: number;
}

export interface UserOrderAllergies {
    attempt?: number;
    consent_message?: string;
    consent_received_datetime?: string;
    consent_sent_datetime?: string;
    created?: string;
    id?: number;
    allergies?: string;
    order_id?: number;
    updated?: string;
    user_id?: number;
}
