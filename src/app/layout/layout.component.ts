import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    constructor(private router: Router) {
        // router.events.forEach((event: NavigationEvent) => {
        //     if (event instanceof NavigationEnd) {
        //         console.log(event.url);
               
        //     }
        // });
    }

    ngOnInit() {
    }

  
}
