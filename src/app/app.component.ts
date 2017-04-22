import { BackendService } from './app.service';
import { Component, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';

import { AppModeService } from '../lib/services/app-mode.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.scss'],
    providers: [
        BackendService
    ]
})
export class AppComponent {
    public title = 'app works!';
    @HostBinding('class') public appTheme = 'app-light-theme';

    constructor(private appModeService: AppModeService) {
    }

    @HostListener('window:resize', ['$event'])
    private onWindowResize() {
        this.appModeService.updateActiveMode();
    }
}
