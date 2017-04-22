import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'api-class-renderer',
    templateUrl: './api-class-renderer.html',
    styleUrls: ['./api-class-renderer.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ApiClassRendererComponent {
    @Input() public classImplementation: any;

    public getPropertyValue(value: string, splitterIndex) {
        if (!value) {
            return '';
        }

        value = '' + value;
        let splitter = this.getSplittedValue(value);

        if (splitter && splitter[splitterIndex]) {
            if (splitterIndex === 0) {
                let returnValue = splitter[0].split('//')[0];

                return returnValue && returnValue.trim().length > 0 ? returnValue + ':' : '';
            }
            return splitter[splitterIndex].split('//')[0];
        }
        return value.split('//')[0];
    }

    public getComment(value: string) {
        if (!value) {
            return '';
        }

        value = '' + value;
        let splitter = value.split('//');

        if (splitter && splitter[1]) {
            return '//' + splitter[1];
        }

        return '';
    }

    private getSplittedValue(value) {
        if (!value) {
            return '';
        }

        value = '' + value;
        let splitter = value.split(':');

        if (splitter.length > 2) {
            return [
                splitter.slice(0, splitter.length - 1).join(': '),
                splitter[splitter.length - 1]
            ];
        }

        return splitter;
    }
}
