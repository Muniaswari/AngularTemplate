import { AppError } from './app-error';

export class AccessDenied extends AppError {
    constructor(error?: any) {
        console.log('2. from interceptor', error);
        const msg = error.message || " Access Denied";
        super(msg);
    }
}