import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'api-reference-reader',
    templateUrl: './api-reference-reader.html',
    styleUrls: ['./api-reference-reader.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ApiReferenceReaderComponent {
    @Input() public data;

    public minSiblingWidth;

    private config = {
        className: ['table-striped', 'table-bordered']
    };
}
