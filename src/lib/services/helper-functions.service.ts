import { Injectable } from '@angular/core';
import { LodashService } from './lodash.service';

@Injectable()
export class HelperFunctionsService {

    constructor(private lodash: LodashService) {
    }

    public isEqualNullCustomized(object: any, objectToCompare: any) {
        return this.lodash.isEqualWith(object, objectToCompare, (value, valueToCompare) => {
            if (this.isNullOrUndefined(value) && this.isNullOrUndefined(valueToCompare)) {
                return true;
            }
        });
    }

    public indexOf(array: any[], item: any) {
        if (!array) {
            return -1;
        }

        for (let i = 0; i < array.length; i++) {
            if (this.lodash.isEqual(array[i], item)) {
                return i;
            }
        }

        return -1;
    }

    public addUidPropToArrayModel(rows: any[]): any[] {
        if (!rows) {
            return [];
        }

        for (const row of rows) {
            if (row.rid) {
                continue;
            }

            row.rid = this.getUid();
        }

        return rows;
    }

    public bindObjectToFunctions(object, functions: string[]) {
        for (const func of functions) {
            if (object && object[func] && (object[func] instanceof Function)) {
                object[func].bind(object);
            }
        }
    }

    public isNullOrUndefined(value: any) {
        return value === null || value === undefined;
    }

    public clone(item) {
        return Object.assign({}, item);
    }

    public cloneWithoutProps(data: Object, removedProps: any[]) {
        const retVal = {};

        for (const key in data) {
            if (removedProps.indexOf(key) !== -1) {
                continue;
            }

            retVal[key] = data[key];
        }

        return retVal;
    }

    public clonePropsToSource(source: Object, data: Object) {
        for (const key in data) {
            if (!source) {
                continue;
            }
            source[key] = data[key];
        }

        return source;
    }

    public getUid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    public isKeyPressedNumeric(event): boolean {
        const value = event && event.target && event.target.value ? event.target.value : '';
        const charCode = this.getCharCodeFromEvent(event);
        return this.isCharNumeric(String(value), event, charCode);
    }

    public getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which === 'undefined') ? event.keyCode : event.which;
    }

    /*
     * Allow only number or only one unit separator (.)
     * 48 to 57 keyboard number
     * 96 to 105 numpad number
     */
    public isCharNumeric(value: string, event, charCode): boolean {
        const allowedKeyCodes = [8, 9, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

        if (charCode === 46 && value.toString().indexOf('.') !== -1) {
            return false;
        }

        if (charCode === 45 && ((event && event.target && event.target.selectionStart !== 0) || (value.toString().indexOf('-') !== -1))) {
            return false;
        }

        if (charCode === 48 && (event && event.target && event.target.selectionStart === 1) && value.toString().indexOf('-') !== -1) {
            return false;
        }

        if (allowedKeyCodes.indexOf(charCode) === -1) {
            return false;
        }

        return true;
    }

    public stopEvent($event) {
        if (!$event) {
            return;
        }

        $event.stopPropagation();
        $event.preventDefault();
    }

    public sortByProperty(array, property, desc: boolean = false, useStringCompare = true) {
        array.sort((a, b) => {
            if (!a) {
                a = {};
            }
            if (!b) {
                b = {};
            }

            if (useStringCompare) {
                return this.compare(a[property].toString().toLowerCase(), b[property].toString().toLowerCase(), desc);
            } else {
                return this.compare(a[property], b[property], desc);
            }
        });
    }

    private compare(a, b, desc: boolean = false) {
        if (a < b) {
            return desc ? 1 : -1;
        }

        if (a > b) {
            return desc ? -1 : 1;
        }

        return 0;
    }
}
