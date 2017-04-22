import { FormGroup } from '@angular/forms';
import { IValidator } from './validation.helper';

export interface FormDefinition {
    name: string;
    theme?: string;
    rows: FormRow[];
}

export interface GenericFormMetadata extends FormGroupMetadata {
    formDefinition: FormDefinition;
}

export interface FormGroupMetadata {
    ngForm: FormGroup;
    initialValue: Object;
}

export interface FormRow {
    elements: FormElement[];
    class?: string;
}

export interface FormElement extends DateTime {
    type: string;
    name: string;
    buttonType?: string;
    placeholder: string;
    class: string;
    icon?: string;
    iconType: string; // prefix, suffinx, in-placeholder
    position?: string;
    value?: string;
    disabled?: boolean;
    width: number;
    validation?: IValidator[];
    radioButtons?: IRadioButton[];
    hint: IHint; // if the hint is used inside autocomplete component {statesMessages} will be used as hint values
    runtimelinks?: BaseLinkRealation[]; // for select, autocomplete a link is interpreted when select event is triggered
    staticLinks: StaticLinkRelation[];
    visibleField?: string; // for multiselect

    config?: any;

    valueField?: string; // for select
    dataSource?: any[]; // for select
    displayFields: any[]; // for select
};

export interface DateTime {
    minDateValue: any;
    maxDateValue: any;
    minDateTime?: any;
    maxDateTime?: any;
    format?: string;
}

export interface IHint {
    align: string; // start, end
    value: string;
}

export interface IRadioButton {
    checked: boolean;
    placeholder: string;
    class: string;
}

export interface BaseLinkRealation {
    control: string;
    executeInSafeContext: boolean;
    validation?: IValidator[];
    fieldName?: string; // the field from the Object value which should be set as value in the linked field
    disabled?: boolean; // an array with the specific option values which should disabled this field
}

export interface StaticLinkRelation extends BaseLinkRealation {
    type: string; // this should be a {LinkType} this is used only for subscription links
    inheritanceObject: Object;
}

export class LinkType {
    public static RESET = 'RESET';
    public static COPY_VALUE = 'COPY_VALUE';
    public static DATA_INHERITANCE = 'DATA_INHERITANCE';
};
