import '../../rx-extensions';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Dictionary } from './../../models/generic-types';
import { ValidatorHelper } from './validation.helper';
import {
    FormDefinition,
    FormElement,
    FormGroupMetadata,
    FormRow,
    GenericFormMetadata,
    LinkType,
    StaticLinkRelation
} from './generic-form-elemets.interfaces';

@Injectable()
export class GenericFormService {
    constructor() {
    }

    public getGenericFormMetadata(formDefinition: FormDefinition): GenericFormMetadata {
        const formMedatata = this.buildNgFormMetadata(formDefinition);
        return {
            formDefinition,
            ngForm: formMedatata.ngForm,
            initialValue: formMedatata.initialValue
        };
    }

    public buildNgFormMetadata(formDefinition: FormDefinition): FormGroupMetadata {
        const initialValue = {};
        const ngForm = new FormGroup({});

        // First we create the form structure without validation
        for (const row of formDefinition.rows) {
            for (const element of row.elements) {
                if (this.isFormControl(element)) {
                    ngForm.addControl(element.name, new FormControl(
                        {value: element.value || '', disabled: element.disabled}
                    ));
                    initialValue[element.name] = element.value || '';

                    this.convertMinMaxValuesToDateObjects(ngForm, element);

                    // We evaluete validation at the end of the stack
                    this.evaluatePropertyAsync(ngForm, element);
                }
            }
        }

        return {
            ngForm,
            initialValue
        };
    }

    public evaluatePropertyAsync(ngForm: FormGroup, element: FormElement) {
        /**
         * This function is runned at the end of the stack so we don't need to loop over the form elements again
         * if a property needs to be evaluated after all controls are defined
         */
        setTimeout(() => {
            ngForm.controls[element.name].validator = ValidatorHelper.getValidators(ngForm, element.validation);
            // This triggers links to run
            // ngForm.controls[element.name].updateValueAndValidity();
        });
    }

    public convertMinMaxValuesToDateObjects(ngForm: FormGroup, element: FormElement) {
        if (['datepicker', 'timepicker', 'datetimepicker'].indexOf(element.type) === -1) {
            return;
        }

        if (element.maxDateTime && element.maxDateTime.indexOf('{ngControlValue=') === -1) {
            element.maxDateValue = new Date(element.maxDateTime);
        }

        if (element.minDateTime && element.minDateTime.indexOf('{ngControlValue=') === -1) {
            element.minDateValue = new Date(element.minDateTime);
        }
    }

    public resetFormToInitialState(formDefinition: FormDefinition, ngForm: FormGroup) {
        const formElements: Dictionary<FormControl> = {};

        formDefinition.rows.forEach((row: FormRow) => {
            row.elements.forEach((element: FormElement) => {
                if (this.isFormControl(element)) {
                    ngForm.controls[element.name].validator = ValidatorHelper.getValidators(ngForm, element.validation);
                    element.disabled
                        ? ngForm.controls[element.name].disable()
                        : ngForm.controls[element.name].enable();
                }
            });
        });
    }

    public resetFormControlValidation(formDefinition: FormDefinition, ngForm: FormGroup, controlName) {
        const formElements: Dictionary<FormControl> = {};

        let rowIndex = 0;
        while (rowIndex < formDefinition.rows.length) {
            let elementIndex = 0;
            while (elementIndex < formDefinition.rows[rowIndex].elements.length) {
                if (formDefinition.rows[rowIndex].elements[elementIndex].name === controlName &&
                    this.isFormControl(formDefinition.rows[rowIndex].elements[elementIndex])) {

                    ngForm.controls[controlName].validator =
                        ValidatorHelper.getValidators(ngForm, formDefinition.rows[rowIndex].elements[elementIndex].validation);
                    return true;
                }
                elementIndex++;
            }

            rowIndex++;
        }

        return false;
    }

    public rezolveFormStaticLinks(formDefinition: FormDefinition, ngForm: FormGroup) {
        const linksSubscriptions = [];

        formDefinition.rows.forEach((row) => {
            row.elements.forEach((element) => {
                if (!element.staticLinks || !this.canUseLinkSubscription(element) || !ngForm.controls[element.name]) {
                    this.setDateTimePickerSpecificLinks(linksSubscriptions, ngForm, element);
                    return;
                }

                linksSubscriptions.push(ngForm.controls[element.name].valueChanges
                    .debounceTime(0)
                    .distinctUntilChanged()
                    .subscribe((currentControlValue) => {
                        element.staticLinks.forEach((link) => {
                            if (!ngForm.controls[link.control]) {
                                return;
                            }

                            this.setStaticLinkValidation(formDefinition, ngForm, link);
                            switch (link.type) {
                                case LinkType.RESET:
                                    if (!currentControlValue) {
                                        return;
                                    }
                                    ngForm.controls[link.control].reset();
                                    break;
                                case LinkType.COPY_VALUE:
                                    ngForm.controls[link.control].reset(currentControlValue);
                                    break;
                                case LinkType.DATA_INHERITANCE:
                                    if (!(link.inheritanceObject instanceof Object) || !link.inheritanceObject[currentControlValue]) {
                                        ngForm.controls[link.control].reset();
                                        return;
                                    }

                                    ngForm.controls[link.control].setValue(link.inheritanceObject[currentControlValue]);
                                    break;
                            }
                        });
                    })
                );
            });
        });

        return linksSubscriptions;
    }

    public setStaticLinkValidation(formDefinition: FormDefinition,
                                   ngForm: FormGroup,
                                   link: StaticLinkRelation) {

        if (!link.validation) {
            return;
        }

        ngForm.controls[link.control].validator = ValidatorHelper.getValidators(ngForm, link.validation);
        ngForm.controls[link.control].updateValueAndValidity();
    }

    public setDateTimePickerSpecificLinks(linksSubscriptions: any[], ngForm: FormGroup, element: FormElement) {
        if (['datepicker', 'timepicker', 'datetimepicker'].indexOf(element.type) === -1) {
            return;
        }

        if (element.maxDateTime && element.maxDateTime.indexOf('{ngControlValue=') !== -1) {
            linksSubscriptions.push(ngForm.controls[element.maxDateTime.replace('{ngControlValue=', '').replace('}', '')].valueChanges
                .subscribe((value) => {
                    element.maxDateValue = new Date(value);

                    // the current datepicker is not resetting it's value
                    const currentControlValue = new Date(ngForm.controls[element.name].value);
                    if (currentControlValue.getTime() > element.maxDateValue.getTime()) {
                        ngForm.controls[element.name].setValue('');
                    }
                }));
        }

        if (element.minDateTime && element.minDateTime.indexOf('{ngControlValue=') !== -1) {
            linksSubscriptions.push(ngForm.controls[element.minDateTime.replace('{ngControlValue=', '').replace('}', '')].valueChanges
                .subscribe((value) => {
                    element.minDateValue = new Date(value);

                    // the current datepicker is not resetting it's value
                    const currentControlValue = new Date(ngForm.controls[element.name].value);
                    if (currentControlValue.getTime() < element.minDateValue.getTime()) {
                        ngForm.controls[element.name].setValue('');
                    }
                }));
        }
    }

    private canUseLinkSubscription(element) {
        return element && element.type && element.type !== 'reset' && element.type !== 'submit'
            && element.type !== 'header'
            /**
             * combobox, autocomplete linkes are treated on element selection
             * so we should not use a subscription for this, also the select event provides more ways to configure
             * a link
             */
            && element.type !== 'combobox'
            // TODO check if the autocomplete component needs to have a link subscription
            && element.type !== 'autocomplete';
    }

    private isFormControl(element) {
        return element && element.type && element.type !== 'reset' && element.type !== 'submit';
    }
}
