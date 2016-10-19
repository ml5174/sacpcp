export const LOGIN_URI = '/rest-auth/login/';
export const REGISTER_URI = '/rest-auth/registration/';
export const RESET_URI = '/rest-auth/password/reset/';
export const REGISTER_USER_URI = '/api/v0.2/salarmy/myprofile/';
export const GET_AVAILABLE_PREFERENCES_URI = '/api/v0.2/salarmy/availablepreferences/';
export const GET_MY_PREFERENCES_URI = '/api/v0.2/salarmy/mypreferences/';
export const GET_MY_PROFILE_URI = '/api/v0.2/salarmy/myprofile/';
export const UPDATE_MY_PROFILE_URI = '/api/v0.2/salarmy/myprofile/';
export const GET_EVENTS_URI = '/api/v0.2/events/events/';
export const GET_LOCATIONS_URI = '/api/v0.2/accounts/locations/';

export var SERVER = window['djangoserver'];
if (document.location.hostname === '198.199.86.127')
    SERVER = 'http://198.199.86.127:8282';


export const STRINGS = {
        password: 'Password',
        username: 'User Name',
        password1: 'Password',
        password2: 'Confirm Password',
        email: 'Email',
        user: "User",
        mobilenumber: "Mobile Number",
        altnumber: "Alt Number",
        address1: "Address 1",
        address2: "Address 2",
        city: "City",
        state: "State",
        zipcode: "Zip Code",
        birthdate: "Birth Date",
        language: "Language",
        notification_option: "Notification Option",
        contactmethod: "Contact Method",
        my_contactmethod_id: "Contact Method",
        volunteertype: "Volunteer Type",
        my_volunteertype_id: "VolunteerType",
        servicearea: "Service Area",
        my_servicearea_id: "Service Area",
        referalsource: "Referral Source",
        my_referalsource_id: "Referral Source",
        donationtype: "Donation Type",
        my_donationtype_id: "Donation Type"
    }