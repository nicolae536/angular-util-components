import { FormGroup } from '@angular/forms';
import { IValidator } from './validators/validation.helper';

export interface GenericFormMetadata extends FormGroupMetadata {
    formDefinition: GenericFormDefinition;
}

export interface FormGroupMetadata {
    ngForm: FormGroup;
    initialValue: Object;
}

// Form configuration interfaces
export interface GenericFormDefinition {
    name: string;
    theme?: string;
    groups: GenericFormGroup[];
    linkResolver?: LinkResolverInterface;
    // rows: GenericFormRow[];
}

export interface GenericFormGroup {
    name: string;
    collapsible?: ICollapsibleGroup;
    rows: GenericFormRow[];
    validation?: IValidator[];
    linkResolver?: LinkResolverInterface;
}

export interface ICollapsibleGroup {
    iconUncollapsed: string;
    iconCollapsed: string;
}

export interface GenericFormRow {
    elements: GenericFormElement[];
    class?: string;
}

export interface GenericFormElement {
    type: string;
    name: string;
    placeholder: string;
    class: string;
    iconType: string; // prefix, suffinx, in-placeholder
    width: number;
    hint: IHint; // if the hint is used inside autocomplete component {statesMessages} will be used as hint values

    // @Optional Propertyes
    icon?: string;
    value?: string;
    disabled?: boolean;
    validation?: IValidator[];
    linkResolver?: LinkResolverInterface;

    // @Specific Propertyes
    buttonType?: string; // for buttons
    radioButtons?: IRadioButton[];
    customFieldConfiguration?: any;
    valueField?: string; // for select
    dataSource?: any[]; // for select
    displayFields: any[]; // for select
}

export interface IHint {
    align: string; // start, end
    value: string;
}

export interface LinkResolverInterface {
    linkName: string;
    configuration: any;
    lockResource: boolean; // if the resolver should listen to other links while this link is resolved
}

export interface IRadioButton {
    checked: boolean;
    placeholder: string;
    class: string;
    color: string;
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
}
