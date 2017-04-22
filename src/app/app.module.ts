import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Ng2TableModule } from 'ng2-table/ng2-table';

import { Ng2ToolsModule } from '../lib/module';

import { APP_ROUTES } from './app.routes';
import { APP_COMPONENTS } from './app-components';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdIconModule, MdSidenavModule, MdToolbarModule } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        ...APP_COMPONENTS
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        Ng2TableModule,
        FormsModule,
        BrowserModule,
        HttpModule,
        Ng2ToolsModule,
        MdIconModule,
        MdToolbarModule,
        MdSidenavModule,
        RouterModule.forRoot(APP_ROUTES)
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
