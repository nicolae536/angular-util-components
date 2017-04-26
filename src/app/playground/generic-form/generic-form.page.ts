import { Component } from '@angular/core';
import { BackendService } from '../../app.service';
import { SERVER_MAP } from '../../shared/server-map';
@Component({
    selector: 'generic-form-page',
    templateUrl: './generic-form.page.html'
})
export class GenericFormPageComponent {
    public formDefinition: {};

    constructor(private appBeckend: BackendService) {
        this.appBeckend.getConfiguration(SERVER_MAP.formDefinitions.newFormExemple)
            .subscribe((formDefinition) => {
                this.formDefinition = formDefinition;
            });
    }
}
