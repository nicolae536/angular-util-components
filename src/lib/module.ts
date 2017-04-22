import { NgModule } from '@angular/core';

import { GenericFormModule } from './components/index';
import { DirectivesModule } from './directives/directives.module';
import { CORE_SERVICES } from './services/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [BrowserAnimationsModule, GenericFormModule, DirectivesModule],
    exports: [GenericFormModule, DirectivesModule],
    providers: [...CORE_SERVICES]
})
export class Ng2ToolsModule {
}
