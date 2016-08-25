export class Strings {
    constructor() {
    }
    strings: {
        username: 'User Name',
        password1: 'Password',
        password2: 'Confirm Password',
        email: 'Email'
    }
    getString(s) {
        return this.strings[s]
    }
}