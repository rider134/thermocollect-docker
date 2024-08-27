import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LogItem } from '../models/logItem';

@Component({
  selector: 'app-serial-log-element',
  templateUrl: './serial-log-element.component.html',
  styleUrls: ['./serial-log-element.component.css']
})
export class SerialLogElementComponent {

  constructor() { }

  height: number = 10

  ngAfterViewInit(): void {
    this.height = this.textField.nativeElement.scrollHeight + 3
  }

  @Input() command!: LogItem;

  @ViewChild('serialLog') textField!: ElementRef; 

  resizeHeight(){
    console.log("test")
  }
}
