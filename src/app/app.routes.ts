import { Routes } from '@angular/router';

import { GenericLayoutComponent } from './shared/generic-layout/generic-layout.component';
import { ApiPageComponent } from './api-page';
import { HomePageComponent } from './home-page/home-page.component';
import { GenericFormPageComponent } from './playground/generic-form/generic-form.page';

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
    },
    {
        path: 'playground/form-play',
        component: GenericFormPageComponent,
    }
];
