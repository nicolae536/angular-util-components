import { ValidatorGenerator } from './validator-genators';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';

/* Validations class*/
export class ValidatorHelper {

    public static getValidators(ngForm: FormGroup, validators: IValidator[]): ValidatorFn {
        // At this point the ngForm must be complete because we rely on his value to compose some validators
        if (!Array.isArray(validators)) {
            return Validators.compose([]);
        }

        return Validators.compose(validators.map((validator) => {
            return ValidatorHelper.getValidator(ngForm, validator);
        }));
    }

    public static getValidator(ngForm: FormGroup, v: IValidator): ValidatorFn {
        let validatorValue = v.validatorValue;
        if (typeof v.validatorValue === 'string' && v.validatorValue.indexOf('{ngControlValue=') !== -1) {
            validatorValue = ngForm.controls[v.validatorValue.replace('{ngControlValue=', '').replace('}', '')].value;
            if (validatorValue === null || validatorValue === undefined || validatorValue === '') {
                return (_: any) => {
                    return null;
                };
            }
        }
        return ValidatorHelper.getDefinedValidator(v.validator, validatorValue, v.errorToken, v.errorMessage);
    }

    public static getDefinedValidator(validatorName: string, validatorValue: string, eToken: string, eMessage: string): ValidatorFn {
        let newRegEx = null;
        try {
            newRegEx = new RegExp(validatorValue);
        } catch (e) {
        }

        switch (validatorName) {
            case 'required':
                return ValidatorGenerator.getAngularFormValidationFn(Validators.required, eToken);
            case 'minLength':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.minLength(Number(validatorValue)), eToken);
            case 'maxLength':
                return ValidatorGenerator.getAngularFormValidationFn(Validators.maxLength(Number(validatorValue)), eToken);
            case 'pattern':
                return ValidatorGenerator.getAngularFormValidationFn(Validators.pattern(newRegEx || validatorValue), eToken);
            case 'email':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.emailValidation, eToken);
            case 'text':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.textValidation, eToken);
            case 'number':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.numberValidation, eToken);
            case 'password':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.passwordValidation, eToken);
            case 'minValue':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.minValue(Number(validatorValue)), eToken);
            case 'maxValue':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.maxValue(Number(validatorValue)), eToken);
            case 'integer':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.integer, eToken);
            case 'maxDecimalLength':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.maxDecimalLength(Number(validatorValue)), eToken);
        }

        return (_: any) => {
            return null;
        };
    }
}

export interface IValidator {
    validator: string; // if is a validator that we already have
    validatorValue: string; // if you want to use your own regex validation
    errorToken?: string;
    errorMessage: string; // TODO check if this is needed
}
