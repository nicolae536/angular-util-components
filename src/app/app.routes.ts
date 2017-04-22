import { GenericLayoutComponent } from './shared/generic-layout/generic-layout.component';
import { ApiPageComponent } from './api-page';
import { HomePageComponent } from './home-page/home-page.component';

import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomePageComponent,
    },
    {
        path: 'api',
        component: ApiPageComponent,
        children: [
            {
                path: ':group/:option',
                component: GenericLayoutComponent,
            }
        ]
    }
];
