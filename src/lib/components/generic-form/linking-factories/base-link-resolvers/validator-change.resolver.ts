import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { GenericFormElement, GenericFormGroup } from '../../generic-form-elemets.interfaces';
import { ILinkResolver } from '../link-factory-resolver.interface';
import { convertToArray, getFormControl } from '../../../../services/helper-functions';
import { IValidator, ValidatorHelper } from '../../validators/validation.helper';

export interface IValidatorChangeMetadata {
    control: string; // control name
    parentGroup: string; // the group which contains the control
    applyValidationAfterUpdate: boolean;
    validation: IValidator[];
}

@Injectable()
export class ValidatorChangeResolver implements ILinkResolver {
    constructor(private validatorHelper: ValidatorHelper) {
    }

    public resolve(genericFormElement: GenericFormGroup | GenericFormElement,
                   rootNgFormGroup: FormGroup,
                   ngFormElement: FormGroup | FormControl,
                   newValue: any) {
        if (!genericFormElement.linkResolver.configuration) {
            throw new Error(`Invalid configuration for validator change ${genericFormElement.linkResolver.linkName}`);
        }

        let validatorChangeMetadata: IValidatorChangeMetadata[] =
            convertToArray<IValidatorChangeMetadata>(genericFormElement.linkResolver.configuration);

        validatorChangeMetadata.forEach((validator: IValidatorChangeMetadata) => {
            let ngFormRef = getFormControl(rootNgFormGroup, validator.parentGroup, validator.control);
            ngFormRef.validator = this.validatorHelper.getValidators(validator.validation);

            if (validator.applyValidationAfterUpdate) {
                ngFormRef.updateValueAndValidity();
            }
        });
    }
}
