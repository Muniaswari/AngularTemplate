import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../shared/guard/auth.service';
import { routerTransition } from '../router.animations';
import { Constants } from '../shared/constants';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [routerTransition()]
})
export class HomeComponent {

    constructor(
        private authService: AuthService,
        private router: Router,
        private constants: Constants
    ) {
    }

}
