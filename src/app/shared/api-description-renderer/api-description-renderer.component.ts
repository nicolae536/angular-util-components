import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'api-description-renderer',
    templateUrl: './api-description-renderer.html',
    styleUrls: ['./api-description-renderer.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ApiDescriptionRendererComponent {
    @Input() public descriptionData;
}
