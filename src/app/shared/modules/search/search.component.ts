import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() fields: any;
  @Input() Total: Number;
  @Output() searchEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  EnableSearch() {
    const field: any = document.getElementById('fieldname');
    const searchvalue: any = document.getElementById('txtSearch');
    this.searchEvent.emit({
      field: field.value,
      value: searchvalue.value
    });
  }

}
