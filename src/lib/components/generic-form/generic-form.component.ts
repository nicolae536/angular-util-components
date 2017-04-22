import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { HelperFunctionsService } from './../../services/helper-functions.service';
import { Dictionary } from './../../models/generic-types';
import { IBackend } from './../../services/searching.service';

import { GenericFormService } from './generic-form.service';
import { FormDefinition, FormElement } from './generic-form-elemets.interfaces';
import { ValidatorHelper } from './validation.helper';

// TODO add style to build
@Component({
    selector: 'ngt-generic-form',
    templateUrl: './generic-form.html',
    styleUrls: [
        './generic-form.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [GenericFormService],
    animations: [
        trigger('fieldHintAnimation', [
            transition(':enter', [
                style({transform: 'translateY(-100%)'}),
                animate('100ms ease-in', style({transform: 'translateY(0)'}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(-100%)'}),
                animate('100ms ease-out')
            ])
        ])
    ]
})
export class GenericFormComponent implements OnDestroy {
    @Input() public color: string;
    @Input() public initialValue: any;
    @Input() public resetFormOnValueChange: boolean = false;
    @Input() public dataServices: Dictionary<IBackend> = {};

    @Input()
    public set formValue(value: any) {
        this.onFormDataChange.next(value);
    };

    @Input()
    public set formDefinition(definition: FormDefinition) {
        this.setFormDefinition(definition);
    };

    @Input() public useDefaultTheme: boolean = true;
    @Input() public enableLogging: boolean = false;

    @Output() public onFormReady: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onValueChange: EventEmitter<IFormState> = new EventEmitter<IFormState>();
    @Output() public onFormSubmit: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('customComponent') public customComponent;

    public genericFormDefinition: FormDefinition = null;
    public ngFormGroup: FormGroup = null;
    public formButtonDisabledState: boolean = true;
    public formIsNotChanged: boolean = true;

    private staticLinksRelations: Subscription[] = [];
    private onFormDataChange: BehaviorSubject<Object> = new BehaviorSubject<Object>(null);

    /**
     * Create a GenericFormComponent.
     * @param {GenericFormService} genericformService // a service which
     * can generate a FormGroup using a definition
     * @param {HelperFunctionsService} helper // a service which
     * contains functions like isNullOrUndefined
     */
    constructor(private genericformService: GenericFormService,
                private helper: HelperFunctionsService) {
        this.setDataChangeSubscription();
    }

    /**
     * @desc setFormDefinition - this function builds
     * the ng form metadata and sets the form to the last value
     * provided in formValue input this function will
     * set a {Subscription} on ngFormGroup.valueChanges
     * @param {FormDefinition} definition - a specific set of rules which generates a ngForm
     */
    public setFormDefinition(definition: FormDefinition) {
        if (this.helper.isNullOrUndefined(definition)) {
            return;
        }

        const formMetadata = this.genericformService.getGenericFormMetadata(definition);
        this.genericFormDefinition = formMetadata.formDefinition;
        this.ngFormGroup = formMetadata.ngForm;
        if (!this.initialValue) {
            this.initialValue = formMetadata.initialValue;
        }
        this.setValueChangeSubscription();
        this.setFormValue(this.onFormDataChange.getValue());
        this.removeStaticLinksBetweenFields();
        this.staticLinksRelations =
            this.genericformService.rezolveFormStaticLinks(this.genericFormDefinition, this.ngFormGroup);
    }

    /**
     * @desc setValueChangeSubscription - will set a {Subscription} on ngFormGroup.valueChanges
     * @param {FormDefinition} definition - a specific set of rules which generates a ngForm
     */
    public setValueChangeSubscription() {
        this.ngFormGroup.valueChanges
            .debounceTime(0)
            .distinctUntilChanged(this.helper.isEqualNullCustomized.bind(this.helper))
            .do(this.setResetState.bind(this))
            .subscribe(this.emitValueAndValidity.bind(this));
    }

    /**
     * @desc setFormValue - checks if the passed value is null and if the value is not null it will reset the form to the specified value
     * @param {Object} value - the value for the form
     */
    public setFormValue(value: Object) {
        if (this.helper.isNullOrUndefined(this.ngFormGroup) || this.helper.isNullOrUndefined(value)) {
            return;
        }

        if (this.resetFormOnValueChange) {
            this.resetForm(value);
            return;
        }

        this.removeStaticLinksBetweenFields();
        this.ngFormGroup.setValue(value);
        setTimeout(() => {
            this.staticLinksRelations = this.genericformService.rezolveFormStaticLinks(this.genericFormDefinition, this.ngFormGroup);
        });
    }

    /**
     * @desc resetForm - Resets the form behavior to default values (validators, disabled, value)
     * @param {Object} value - the value for the new reseted form
     */
    public resetForm(value: Object) {
        if (this.helper.isNullOrUndefined(this.ngFormGroup)) {
            // the ngFormIsNotRendered
            return;
        }

        this.genericformService.resetFormToInitialState(this.genericFormDefinition, this.ngFormGroup);
        this.resetFormValue(value);
        this.formIsNotChanged = true;
    }

    /**
     * @desc resetFormValue - removes the links between the fields to not trigger weird form changes
     *                        after the new value is set will rezolve the links between fields
     * @param {Object} value - the value for the new reseted form
     */
    public resetFormValue(value: Object) {
        if (this.helper.isNullOrUndefined(this.ngFormGroup)) {
            // the ngFormIsNotRendered
            return;
        }
        // first remove all links to not trigger unexpected behavior
        this.removeStaticLinksBetweenFields();

        // If null is passed to the reset function this will fail
        this.ngFormGroup.reset(this.helper.isNullOrUndefined(value) ? undefined : value);

        setTimeout(() => {
            this.staticLinksRelations = this.genericformService.rezolveFormStaticLinks(this.genericFormDefinition, this.ngFormGroup);
        });
    }

    /**
     * @desc removeLinksBetweenFields - removes the links between the fields
     */
    public removeStaticLinksBetweenFields() {
        this.staticLinksRelations.forEach((v) => {
            v.unsubscribe();
        });
        this.staticLinksRelations = [];
    }

    /**
     * @viewCallback
     * @desc select - TODO implement a select behavior
     * @param {} event
     */
    public select(field: FormElement, selectedOption: Object) {
        if (!field || !field.runtimelinks) {
            return;
        }

        field.runtimelinks.forEach((relation) => {
            if (!this.ngFormGroup.controls[relation.control]) {
                return;
            }

            if (relation.executeInSafeContext) {
                // The relation might trigger cascade changes and we don't want that
                this.removeStaticLinksBetweenFields();
            }

            this.ngFormGroup.controls[relation.control].validator =
                ValidatorHelper.getValidators(this.ngFormGroup, relation.validation);

            if (Array.isArray(relation.disabled)) {
                (<any[]> relation.disabled).indexOf(selectedOption[field.valueField]) !== -1
                    ? this.ngFormGroup.controls[relation.control].disable()
                    : this.ngFormGroup.controls[relation.control].enable();
            }

            if (relation.fieldName && (selectedOption instanceof Object) && (selectedOption.hasOwnProperty(relation.fieldName))) {
                this.ngFormGroup.controls[relation.control].setValue(selectedOption[relation.fieldName]);
            }

            if (relation.executeInSafeContext) {
                // Rebuild linked state so the next relation will have to deactivate it if needed
                this.staticLinksRelations = this.genericformService.rezolveFormStaticLinks(this.genericFormDefinition, this.ngFormGroup);
            }
        });

        this.ngFormGroup.updateValueAndValidity();
    }

    /**
     * @viewCallback
     * @desc select - TODO implement a select behavior
     * @param {} event
     */
    public getDisplayField(field: FormElement, option: Object) {
        let displayValue = '';
        let i = 0;

        while (field.displayFields.length > i && displayValue === '') {
            displayValue = option[field.displayFields[i]] || '';
            i++;
        }

        return displayValue;
    }

    /**
     * @viewCallback
     * @desc onSubmit - if the key pressed is not numberic will stop the event
     * @param {BrowserEvent} event
     */
    public onSubmit(event) {
        this.onFormSubmit.emit({event, value: this.ngFormGroup.value});
    }

    /**
     * @viewCallback
     * @desc onNumberFieldKeyPress - if the key pressed is not numberic will stop the event
     * @param {} event
     */
    public onNumberFieldKeyPress($event) {
        if (!this.helper.isKeyPressedNumeric(event)) {
            this.helper.stopEvent($event);
        }
    }

    public ngOnDestroy() {
        this.removeStaticLinksBetweenFields();
    }

    private setInputAsTouched(field: FormElement) {
        this.ngFormGroup.controls[field.name].markAsTouched();
    }

    private getTranslatedError(field: FormElement, control: FormControl) {
        if (control && control.errors && control.errors['errorToken']) {
            return this.translate(control.errors['errorToken']);
        }

        // TODO add this to debugging mode
        // console.warn(`No error token defined for ${field.name}`, field);
        return '';
    }

    private translate(token) {
        return token;
    }

    /**
     * @desc scheduleFormReadyEmit - sets onFormReady to be emited at the end of the call stack
     */
    private scheduleFormReadyEmit() {
        setTimeout(() => {
            this.onFormReady.emit();
        });
    }

    /**
     * @desc emitValueAndValidity - handler for {ngFormGroup.valueChanges} subscription will emit a new form value and also the validity
     * @param {Object} newValue
     */
    private emitValueAndValidity(newValue: Object) {
        this.onValueChange.emit({valid: this.ngFormGroup.valid, value: newValue});

        if (!this.ngFormGroup.valid !== this.formButtonDisabledState) {
            this.formButtonDisabledState = !this.ngFormGroup.valid;
        }
    }

    private setResetState(newValue: Object) {
        this.formIsNotChanged = this.helper.isEqualNullCustomized(newValue, this.initialValue);
    }

    /**
     * @desc setDataChangeSubscription - Function which sets a subscription to onFormDataChange,
     *                                   which means each time we set a form value we will pass through this filters and will execute the
     *                                   @function setFormValue with the new form value
     */
    private setDataChangeSubscription() {
        this.onFormDataChange
            .filter((v) => {
                return !this.helper.isNullOrUndefined(v);
            })
            .debounceTime(0)
            .distinctUntilChanged(this.helper.isEqualNullCustomized.bind(this.helper))
            .subscribe(this.setFormValue.bind(this));
    }
}

export interface IFormState {
    value: any;
    valid: boolean;
}
