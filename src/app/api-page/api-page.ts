import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { SERVER_MAP } from './../shared/server-map';
import { BackendService } from './../app.service';

import { IMenuGroup } from './shared/components-menu/menu-group.interface';
import { AppMode, AppModeService } from '../../lib';
import { AppCommunicationService } from './../shared/app-communication.service';

@Component({
    selector: 'api-page',
    templateUrl: './api-page.html',
    styleUrls: ['./api-page.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [AppCommunicationService]
})
export class ApiPageComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') public sideNavComponent: MdSidenav;

    private sideNavOptions = {
        mode: 'side',
        opened: false
    };
    private menuConfiguration: IMenuGroup[];
    private _subscriptions: Subscription[] = [];

    constructor(private appModeService: AppModeService,
                private appCommunicationService: AppCommunicationService,
                private backend: BackendService) {
        this._subscriptions.push(
            this.appModeService.activeMode.debounceTime(0).subscribe(this.setSideNaveMode.bind(this)),
            this.appCommunicationService.getChannel('OPEN_SIDE_MENU').subscribe(this.openSideMenu.bind(this)),
            this.appCommunicationService.getChannel('CLOSE_SIDE_MENU').subscribe(this.closeSideMenu.bind(this))
        );
    }

    public ngOnInit() {
        this.backend.getConfiguration<IMenuGroup[]>(SERVER_MAP.appSideMenu)
            .subscribe((menuItems) => {
            this.menuConfiguration = menuItems;
        });
    }

    public closeSideMenu() {
        if (!this.sideNavComponent || this.sideNavOptions.mode !== 'over') {
            return;
        }
        this.sideNavComponent.close();
    }

    public openSideMenu() {
        if (!this.sideNavComponent) {
            return;
        }
        this.sideNavComponent.open();
    }

    public onItemClicked() {
        if (this.sideNavOptions.mode === 'over') {
            this.sideNavComponent.close();
        }
    }

    public ngOnDestroy() {
        this._subscriptions.forEach((value) => {
            value.unsubscribe();
        });
        this._subscriptions = [];
    }

    private setSideNaveMode(mode) {
        switch (mode) {
            case AppMode.TABLET:
            case AppMode.MOBILE:
                this.sideNavOptions.mode = 'over';
                this.sideNavOptions.opened = false;
                break;
            default:
                this.sideNavOptions.mode = 'side';
                this.sideNavOptions.opened = true;
                break;
        }
    }
}
