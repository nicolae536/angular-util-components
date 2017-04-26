import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenericFormComponent } from './generic-form.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomElementContainerComponent } from '../custom-element-container/custom-element-container.component';
import { MATERIAL_DEPENDENCYES } from './material.dependencies';
import { CustomValidatorService, ICustomValidationService } from './validators/custom-validator-type.service';
import { AbstractLinkFactoryResolver, CustomFactoryResolver } from './linking-factories/link-factory-resolver.interface';

export interface IFormServices {
    validationService?: ICustomValidationService;
    linkFactoryResolver?: AbstractLinkFactoryResolver;
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ...MATERIAL_DEPENDENCYES
    ],
    exports: [GenericFormComponent],
    declarations: [GenericFormComponent, CustomElementContainerComponent]
})
export class GenericFormModule {
    public static withServices(formHelperServices: IFormServices) {
        return {
            ngModule: GenericFormModule,
            providers: [
                {
                    provide: CustomValidatorService, useClass: formHelperServices.validationService
                },
                {
                    provide: CustomFactoryResolver, useClass: formHelperServices.linkFactoryResolver
                },
            ]
        }
    }
}

