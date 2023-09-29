import { Component, HostListener } from '@angular/core';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  },
  providers: [ TimerService ]
})
export class MainComponentComponent {

  grid: boolean = false;
  precisionMode: boolean = false;
  
  constructor(public timerService: TimerService) {
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Shift") this.grid = !this.grid;
    else if(event.key === "Control") this.precisionMode = !this.precisionMode;
  }
}
