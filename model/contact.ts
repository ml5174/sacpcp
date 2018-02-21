export class Contact{
    //CONTACT_METHODS: enum = { none, mobile, text };
    first_name: string
    last_name: string
    status: number
    role: number
    isContactSelected: boolean = false;
    isPhoneSelected: boolean = false;
    isEmailSelected: boolean = false;
    contactString: string
    mobilenumber: number
    email: string
    isAdmin:number
    isActive: number
    ext_id?: string
    }