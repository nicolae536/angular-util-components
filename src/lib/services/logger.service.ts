import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
    public logError(error: Error) {
        if (process.env.ENV === 'production') {
            return;
        }

        console.log(error);
        console.log('ERROR STACK TRACE:');
        console.log(error.stack);
    }

    public logWarning(warn) {
        if (process.env.ENV === 'production') {
            return;
        }

        console.warn(warn);
    }

    public log(message) {
        if (process.env.ENV === 'production') {
            return;
        }

        console.log(message);
    }
}
