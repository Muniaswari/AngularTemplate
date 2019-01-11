import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../shared/services/menu.service';

@NgModule({
    imports: [
        TranslateModule,
        CommonModule,
        LayoutRoutingModule,
        NgbDropdownModule.forRoot()
    ],
    exports: [TranslateModule],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent
    ],
    providers: [
        MenuService
    ]
})
export class LayoutModule { }
