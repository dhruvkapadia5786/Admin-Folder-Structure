export interface Question {
    id?: number;
    type:string;

    isMultiSelect: boolean;
    text: string;
    sequence?: number;
    is_active: boolean;
    hasInput?: boolean;
    hasLogic?: boolean;
    medicine_kit_id?: number;
    medicine_kit_name?: string;
    category_id?: number;
    category_name?: string;
    condition_id?: number;
    condition_name?: string;
    choices?: QuestionChoice[];
    kits?: any[];
    states?: any[];
    state_ids?: any[];
    selected_kit_ids?: any[];
    parent_question_id?:any;
    custom_input?:any;
    sub_questions?:any[];
}

export interface QuestionChoice {
    id?: number;
    text: string;
    result: number;
    is_active: boolean;
    has_file_upload?: boolean;
    question_id?: number;
    consent_message?: string;
    has_subquestions?:boolean;
    sub_questions?:any[];
}


