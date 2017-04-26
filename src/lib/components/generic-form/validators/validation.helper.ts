import { ValidatorGenerator } from './validator-genators';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CustomValidatorService } from './custom-validator-type.service';

@Injectable()
export class ValidatorHelper {
    constructor(private customValidationService: CustomValidatorService) {

    }

    public getValidators(validators: IValidator[]): ValidatorFn {
        // At this point the ngForm must be complete because we rely on his value to compose some validators
        if (!validators || !Array.isArray(validators)) {
            return Validators.compose([]);
        }

        return Validators.compose(validators.map((validator) => {
            return this.getValidator(validator);
        }));
    }

    public getValidator(v: IValidator): ValidatorFn {
        return this.getDefinedValidator(v.validator, v.validatorValue, v.errorToken);
    }

    public getDefinedValidator(validatorName: string, validatorValue: string, eToken: string): ValidatorFn {
        if (this.customValidationService.hasValidator(validatorName)) {
            return this.customValidationService.getValidator(validatorName, validatorValue, eToken);
        }

        switch (validatorName) {
            case 'required':
                return ValidatorGenerator.getAngularFormValidationFn(Validators.required, eToken);
            case 'minLength':
                return ValidatorGenerator.getFormValidationFn(ValidatorGenerator.minLength(Number(validatorValue)), eToken);
            case 'maxLength':
                return ValidatorGenerator.getAngularFormValidationFn(Validators.maxLength(Number(validatorValue)), eToken);
            case 'pattern':
                return ValidatorGenerator.getAngularFormValidationFn(
                    Validators.pattern(this.getRegex(validatorValue) || validatorValue),
                    eToken
                );
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

        throw new Error(`No validator found with name ${validatorName}`);
    }

    public getRegex(regexValue: string) {
        try {
            return new RegExp(regexValue);
        } catch (e) {
            throw new Error(`Invalid regex value ${regexValue}`);
        }
    }
}

export interface IValidator {
    validator: string; // if is a validator that we already have
    validatorValue: string; // needed for some types of validation
    errorToken?: string; // needed for translation
}