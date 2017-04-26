import { GenericFormElement, GenericFormGroup } from '../generic-form-elemets.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

export interface ILinkResolver {
    resolve(genericFormElement: GenericFormGroup | GenericFormElement,
            rootNgFormGroup: FormGroup,
            ngFormElement: FormGroup | FormControl,
            newValue: any);
}

export interface AbstractLinkFactoryResolver {
    hasFactory(linkName): boolean;
    getFactoryByLinkName(linkName: string): ILinkResolver;
}

@Injectable()
export class CustomFactoryResolver implements AbstractLinkFactoryResolver {
    public hasFactory(linkName: any): boolean {
        return false;
    }

    public getFactoryByLinkName(linkName: string): ILinkResolver {
        throw new Error('Method not implemented.');
    }
}
