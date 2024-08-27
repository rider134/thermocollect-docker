import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Facade, initFacade } from '../models/facade';
import { LogItem } from '../models/logItem';
import { LyTheme2, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'facade-control',
  templateUrl: './facade-control.component.html',
  styleUrls: ['./facade-control.component.css'],
})
export class FacadeControlComponent implements OnInit {
  constructor(private theme: LyTheme2, private apiService: ApiService){}
  facade: Facade = initFacade();
  facadeMode : number = 0; 
  facadeAngle : number = 0; 
  markAngle : number =0;
  facades: Facade[] = [];
  commandResponse: string = "Hier kommt die Antwort"
  commands: LogItem[] = []
  inputCommand : string=""
  disabled = true;
  marks = false;
  min : number = 0
  max : number = 100
  
  @ViewChild("serialLogBox", { static: true })
  private serialLogBox!: ElementRef;


  ngOnInit(): void {
    this.loadFacades()
  }

  loadFacades() {
    this.apiService.getFacades()
      .subscribe((data: Facade[]) => this.facades = data);
  }

  updateFacade(){
    this.facade.mode = this.facadeMode
    this.facade.angle = this.facadeAngle

    this.apiService.putFacades(this.facade).subscribe({
        next: (v) => {console.log(v); this.updateMessageList("Updated Facade" + this.facades.find(f => f.id == v.id)?.facadeId + " Response: " + v.message)},
        error: (e) => this.updateMessageList(e.message),
        complete: () => console.info('complete') 
    })
  }

  changeFacade(facade: Facade)
  {
    console.log(facade)
    this.facade = facade
    this.facadeMode = facade.mode
    this.facadeAngle = facade.angle
    this.onModeChange(this.facadeMode)
  }

  sendCommand()
  {
    const logEntry: LogItem = {
      message : this.inputCommand,
      type: 'Sent:'
    }
    if(this.commands.length > 50)
      this.commands.shift()

    this.commands = [...this.commands, logEntry]
    this.scrollToEnd()
    
    this.apiService.putCommand(this.inputCommand)
      .subscribe({ 
          next: (v) => {this.updateMessageList(v.message)},
          error: (e) => this.updateMessageList(e.message),
          complete: () => console.info('complete') 
        })

    this.inputCommand = ""
  }

  onModeChange(value:number)
  { 
    //console.log(value)
    if(value === 3 || value === 4 || value === 5)
      this.disabled=false
    else
      this.disabled=true

    if(value == 3){
      this.min = 80
      this.max = 180
    }
    else{
      this.min = 0
      this.max = 100
    }
  }

  updateMessageList(entry: string)
  {
    const logEntry: LogItem = {
      message: entry,
      type: ''
    }
    if(this.commands.length > 50)
      this.commands.shift()
    this.commands = [...this.commands, logEntry]

    this.scrollToEnd()
  }

  scrollToEnd()
  {
    this.serialLogBox.nativeElement.scrollTop = this.serialLogBox.nativeElement.scrollHeight
    setTimeout(() => {
      const items = document.getElementsByClassName("logItem");
      items[items.length - 1].scrollIntoView();
    }, 10);
  }
}
