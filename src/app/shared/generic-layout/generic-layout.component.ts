import { SERVER_MAP } from './../server-map';
import { BackendService } from './../../app.service';
import { AppCommunicationService } from './../app-communication.service';
import { AppModeService, Dictionary } from '../../../lib';
import { Subscription } from 'rxjs/Subscription';
import { Component, HostBinding, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'generic-layout',
    templateUrl: './generic-layout.html',
    styleUrls: ['./generic-layout.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GenericLayoutComponent implements OnDestroy {
    @HostBinding('class') public currentView;

    private headerGroup;
    private headerOption;
    private pageData;

    private _subscriptions: Subscription[] = [];

    constructor(private activatedRoute: ActivatedRoute,
                private appCommunicationService: AppCommunicationService,
                private appModeService: AppModeService,
                private backend: BackendService) {
        this._subscriptions.push(
            this.activatedRoute.params.subscribe(this.setHeaderValue.bind(this)),
            this.appModeService.activeMode.subscribe(this.setCurrentView.bind(this))
        );
    }

    public ngOnDestroy() {
        this._subscriptions.forEach((value) => {
            value.unsubscribe();
        });
        this._subscriptions = [];
    }

    public setHeaderValue(params: Dictionary<any>) {
        this.headerGroup = params['group'] || '';
        this.headerOption = params['option'] || '';
        this.appCommunicationService.sendNotification('CLOSE_SIDE_MENU');
        this.getPageData(this.headerGroup, this.headerOption);
    }

    public getPageData(group, option) {
        this.backend.getConfiguration(SERVER_MAP[group][option])
            .subscribe((value) => {
                this.pageData = value;
            });
    }

    public openSideMenu() {
        this.appCommunicationService.sendNotification('OPEN_SIDE_MENU');
    }

    public setCurrentView(view: string) {
        this.currentView = view.toLowerCase();
    }
}
