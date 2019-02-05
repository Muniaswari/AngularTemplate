import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminDashboardRoutingModule } from './admindashboard-routing.module';
import { AdminDashboardComponent } from './admindashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        AdminDashboardRoutingModule,
        StatModule
    ],
    declarations: [
        AdminDashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent
    ]
})
export class AdminDashboardModule {}
