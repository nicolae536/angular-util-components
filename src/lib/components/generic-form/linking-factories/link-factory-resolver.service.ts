import { Injectable } from '@angular/core';
import { AbstractLinkFactoryResolver, CustomFactoryResolver, ILinkResolver } from './link-factory-resolver.interface';
import { BASE_FACTORY_TYPES } from './base-factoryes-map';
import { Dictionary } from '../../../models/generic-types';
import { ValidatorChangeResolver } from './base-link-resolvers/validator-change.resolver';
import { GenericFormElement, GenericFormGroup } from '../generic-form-elemets.interfaces';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class LinkFactoryResolverService implements AbstractLinkFactoryResolver {
    private factories: Dictionary<ILinkResolver> = {};

    constructor(private customFactoryResolver: CustomFactoryResolver,
                private validatorChangeResolver: ValidatorChangeResolver) {
        this.setKnownFactories();
    }

    public resolveLink(genericFormElement: GenericFormGroup | GenericFormElement,
                       rootNgFormGroup: FormGroup,
                       ngFormElement: FormGroup | FormControl,
                       newElementValue: any) {
        this.getFactoryByLinkName(genericFormElement.linkResolver.linkName)
            .resolve(genericFormElement, rootNgFormGroup, ngFormElement, newElementValue);
    }

    public hasFactory(linkName): boolean {
        return this.factories.hasOwnProperty(linkName);
    }

    public getFactoryByLinkName(linkName: string): ILinkResolver {
        if (this.customFactoryResolver.hasFactory(linkName)) {
            return this.customFactoryResolver.getFactoryByLinkName(linkName);
        }

        if (!this.hasFactory(linkName)) {
            throw new Error(`Cannot provide factory for link: ${linkName}`);
        }

        return this.factories[linkName];
    }

    private setKnownFactories() {
        this.factories[BASE_FACTORY_TYPES.VALIDATOR_CHANGE] = this.validatorChangeResolver;
    }
}
