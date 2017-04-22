import { Component, ViewEncapsulation } from '@angular/core';
import { AppMode, AppModeService } from '../../lib';

@Component({
    selector: 'home-page',
    templateUrl: './home-page.html',
    styleUrls: ['./home-page.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomePageComponent {
    public formDefinition = null;
    public value = null;
    public dataServices = {};
    public isMobileView;
    public isTablet;

    constructor(private appModeService: AppModeService) {
        this.appModeService.activeMode.subscribe(this.setCurrentView.bind(this));
    }

    public setCurrentView(view: string) {
        this.isMobileView = view === AppMode.MOBILE;
        this.isTablet = view === AppMode.TABLET;
    }
}
