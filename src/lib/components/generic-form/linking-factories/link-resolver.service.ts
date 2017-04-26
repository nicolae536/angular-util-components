import { Injectable } from '@angular/core';
import { GenericFormElement, GenericFormGroup } from '../generic-form-elemets.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { LodashService } from '../../../services/lodash.service';
import { LinkFactoryResolverService } from './link-factory-resolver.service';

@Injectable()
export class LinkResolverService {
    private isFactoryLocked: boolean = true;

    constructor(private lodash: LodashService,
                private linkFactoryResolver: LinkFactoryResolverService) {
    }

    public startLinkWatcher() {
        this.isFactoryLocked = false;
    }

    public addLinkResolver(genericFormElement: GenericFormGroup | GenericFormElement,
                           rootNgFormGroup: FormGroup,
                           ngFormElement: FormGroup | FormControl) {
        if (!genericFormElement || !genericFormElement.linkResolver) {
            return;
        }

        ngFormElement.valueChanges
            .debounceTime(0)
            .distinctUntilChanged(this.lodash.isEqual)
            .filter((value) => this.isFactoryLocked)
            .subscribe((newElementValue) => {
                this.resolveLink(genericFormElement, rootNgFormGroup, ngFormElement, newElementValue);
            });
    }

    public resolveLink(genericFormElement: GenericFormGroup | GenericFormElement,
                       rootNgFormGroup: FormGroup,
                       ngFormElement: FormGroup | FormControl,
                       newElementValue: any) {

        if (genericFormElement.linkResolver.lockResource) {
            this.isFactoryLocked = true;
        }

        this.linkFactoryResolver.resolveLink(genericFormElement, rootNgFormGroup, ngFormElement, newElementValue);

        setTimeout(() => {
            // we wait for angular to finish his cycle before unlocking the resolver
            this.isFactoryLocked = false;
        });
    }
}

