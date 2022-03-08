import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
    RfbloyaltySharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';

@NgModule({
    imports: [
        RfbloyaltySharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    providers: [
        Title
    ],
    exports: [
        RfbloyaltySharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ]
})
export class RfbloyaltySharedCommonModule {}
