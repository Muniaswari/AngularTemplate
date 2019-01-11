import { Injectable } from '@angular/core';

export class AppError {
    constructor(public message: string, public title: string = 'Error') {
        console.log('3. parent class of custom error handler');
    }
}