import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'api-component-presentation',
    templateUrl: './api-component-presentation.html',
    styleUrls: ['./api-component-presentation.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ApiComponentPresentationComponent {
    @Input() public componentPresentationData;
}
