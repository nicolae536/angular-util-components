import { AbstractControl, ValidatorFn } from '@angular/forms';

/* Validations class*/
export class ValidatorGenerator {

    public static getAngularFormValidationFn(validationFunction: ValidationFn, eToken: string): ValidatorFn {
        return (c: AbstractControl) => {
            const validationResult = validationFunction(c);

            if (!validationResult) {
                return validationResult;
            }

            if (validationResult instanceof Object && eToken) {
                validationResult['errorToken'] = eToken;
            }
            return validationResult;
        };
    }

    public static getFormValidationFn(validationFunction: ValidationFn, eToken: string): ValidatorFn {
        return (c: AbstractControl) => {
            const value = c.value;
            const validationResult = validationFunction(value);

            if (!validationResult) {
                return validationResult;
            }

            if (validationResult instanceof Object && eToken) {
                validationResult['errorToken'] = eToken;
            }
            return validationResult;
        };
    }

    public static minLength(minLengthValue): ValidationFn {
        return (value: any): { [key: string]: any } => {
            const valueAsString = String(value);

            if (valueAsString.length < minLengthValue) {
                return {
                    minlength: {
                        requiredLength: minLengthValue,
                        actualLength: valueAsString.length
                    }
                };
            }

            return null;
        };
    }

    /**
     * Decimal Validator
     * @return {(control: AbstractControl): { [key: string]: any }} Validation function;
     */
    public static maxDecimalLength(decimalCount: number): ValidationFn {
        return (value: any): { [key: string]: any } => {
            const valueAsString = `${value}`;
            if (value === null || value === undefined || valueAsString === '') {
                return null;
            }

            if (+decimalCount === 0 && valueAsString.indexOf('.') !== -1) {
                return {maxDecimalLength: decimalCount};
            }

            const decimalStringValue = valueAsString.replace(new RegExp(/^([0-9]*.)/), '');
            return decimalStringValue !== '0' && decimalStringValue.length > decimalCount ? {maxDecimalLength: decimalCount} : null;
        };
    }

    public static minValue(minValue: number): ValidationFn {
        return (value: any): { [key: string]: any } => {
            if (value === null || value === undefined || value === '') {
                return null;
            }

            return Number(value) < Number(minValue) ? {
                minValue: {
                    minValue,
                    actualvalue: value
                }
            } : null;

        };
    }

    public static maxValue(maxValue: number): ValidationFn {
        return (value: any): { [key: string]: any } => {
            if (value === null || value === undefined || value === '') {
                return null;
            }

            return Number(value) > Number(maxValue) ? {
                maxValue: {
                    maxValue,
                    actualvalue: value
                }
            } : null;
        };
    }

    /**
     * Email validator.
     * @return {string} Error map.
     * @return {null} Validation has passed.
     */
    public static emailValidation(value: string): IValidationResult {
        // tslint:disable-next-line:max-line-length
        const email = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (value && value !== '' && !value.match(email)) {
            return {email: true};
        }

        return null;
    }

    /**
     * Text validator.
     * @return {string} Error map.
     * @return {null} Validation has passed.
     */
    public static textValidation(value: string): IValidationResult {
        const textRegExp = /^[a-zA-Z ]*$/;

        if (value !== '' && !textRegExp.test(value)) {
            return {text: true};
        }

        return null;
    }

    /**
     * Number validator.
     * @return {string} Error map.
     * @return {null} Validation has passed.
     */
    public static numberValidation(value: any): IValidationResult {
        const valueAsString = String(value);
        if (value !== undefined && value !== null && valueAsString !== '' &&
            (isNaN(value) ||
            valueAsString[0] === '.' ||
            valueAsString[valueAsString.length - 1] === '.')) {
            return {number: true};
        }

        if (value !== undefined && value !== null && valueAsString !== '') {
            const indexOfDash = valueAsString.indexOf('-');
            const numberOfDashes = (valueAsString.match(/-/g) || []).length;
            const numberOfZerosAfterDash = (valueAsString.match(/-0[0]*/g) || []).length;
            const hasZeroAfterDash = numberOfZerosAfterDash > 0 && !(numberOfZerosAfterDash === 1 && valueAsString[2] === '.');
            if ((indexOfDash !== 0 && indexOfDash !== -1) ||
                numberOfDashes > 1 ||
                hasZeroAfterDash ||
                valueAsString.indexOf('.-') !== -1 ||
                valueAsString.indexOf('-.') !== -1) {
                return {number: true};
            }
        }

        return null;
    }

    /**
     * Integer validation
     * @return {(control: AbstractControl): { [key: string]: any }} Validation function;
     */
    public static integer(value: string): IValidationResult {
        if (ValidatorGenerator.numberValidation(value) !== null) {
            return {
                integer: true
            };
        }

        const zeroDecimalCount = ValidatorGenerator.maxDecimalLength(0);
        if (zeroDecimalCount(value) !== null) {
            return {
                integer: true
            };

        }

        return null;
    }

    /**
     * Password validator.
     * @return {string} Error map.
     * @return {null} Validation has passed.
     */
    public static passwordValidation(value: string): IValidationResult {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        const passwordRegex = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/;

        if (!value.match(passwordRegex)) {
            return {password: true};
        }

        return null;
    }
}

/* Interface for error map */
export interface IValidationResult {
    [key: string]: boolean;
}

type ValidationFn = (value: any) => {
    [key: string]: any;
};
