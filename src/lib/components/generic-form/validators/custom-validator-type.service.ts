import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { ValidatorGenerator } from './validator-genators';

export interface ICustomValidationService {
    getValidator(validatorName: string, validatorValue: string, eToken: string): ValidatorFn;
    hasValidator(validatorName: string): boolean;
}

@Injectable()
export class CustomValidatorService implements ICustomValidationService {
    public hasValidator(validatorName: string): boolean {
        return false;
    }

    public getValidator(validatorName: string, validatorValue: string, eToken: string): ValidatorFn {
        return ValidatorGenerator.getEmptyValidationFn();
    }
}
