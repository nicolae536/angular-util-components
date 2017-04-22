import { IMenuGroup } from './menu-group.interface';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'components-menu',
    templateUrl: './components-menu.html',
    styleUrls: ['./components-menu.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ComponentsMenuComponent {
    @Input() set menuItems(items: IMenuGroup[]) {
        this.setCurrentItems(items);
    };

    @Output() public onItemClicked: EventEmitter<any> = new EventEmitter<any>();

    private viewMenuItems: IMenuGroup[] = [];

    constructor(private router: Router) {
        this.router.events.subscribe((navigation) => {
            if (navigation instanceof NavigationEnd) {
                this.markActiveItem();
            }
        });
    }

    public navigateToUrl(item) {
        this.onItemClicked.emit(item);
        this.router.navigate(item.url);
    }

    public setCurrentItems(items: IMenuGroup[]) {
        if (!items) {
            return;
        }
        this.viewMenuItems = items;
        this.markActiveItem();
    }

    public markActiveItem() {
        if (!this.viewMenuItems) {
            return;
        }

        this.viewMenuItems.forEach((element) => {
            element.optionsList.forEach((listItem) => {
                listItem.selected = ('' + location.href).indexOf(listItem.url) !== -1;
            });
        });
    }
}
