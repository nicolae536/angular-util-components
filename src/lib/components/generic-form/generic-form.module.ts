import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GenericFormComponent } from './generic-form.component';
import { DirectivesModule } from '../../directives/directives.module';
import { CustomElementContainerComponent } from '../custom-element-container/custom-element-container.component';
import { MATERIAL_DEPENDENCYES } from './material.dependencies';

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
}
