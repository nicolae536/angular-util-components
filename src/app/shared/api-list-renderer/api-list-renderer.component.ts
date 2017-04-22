import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'api-list-renderer',
    templateUrl: './api-list-renderer.html',
    styleUrls: ['./api-list-renderer.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ApiListRendererComponent {
    @Input() public apiData: any;
}
