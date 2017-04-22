import { Subject } from 'rxjs/Subject';
import { AppMode } from './../models/app-modes';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class AppModeService {
    public isMobildeView = false;
    public isTabletView = false;
    public isDesktopView = false;

    public activeMode: BehaviorSubject<string> = new BehaviorSubject<string>(AppMode.DESKTOP);

    private windowResize: Subject<any> = new Subject<any>();
    private mobileRegex = /Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i;
    private tabletRegex = /Tablet|iPad/i;

    constructor() {
        this.windowResize
            .debounceTime(200)
            .subscribe(this.checkActiveMode.bind(this));
        this.updateActiveMode();
    }

    public updateActiveMode() {
        this.windowResize.next();
    }

    public checkActiveMode() {
        this.resetModes();

        const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (width >= 768 && width <= 1024) {
            // navigator.userAgent.match(this.tabletRegex)
            this.isTabletView = true;
            this.activeMode.next(AppMode.TABLET);
        } else if (width >= 320 && width < 768) {
            // navigator.userAgent.match(this.mobileRegex)
            this.isMobildeView = true;
            this.activeMode.next(AppMode.MOBILE);
        } else {
            this.isDesktopView = true;
            this.activeMode.next(AppMode.DESKTOP);
        }
    }

    public resetModes() {
        this.isDesktopView = false;
        this.isTabletView = false;
        this.isDesktopView = false;
    }
}
