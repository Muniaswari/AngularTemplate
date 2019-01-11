import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDateFormat',
})

export class CustomDateFormatPipe implements PipeTransform {
    transform(value: string) {
       // this.datePipe.transform(new Date(), 'dd-MM-yy');
        const datePipe = new DatePipe('en-US');
        value = datePipe.transform(value, 'dd-mm-yyyy');
        return value;
    }
}
