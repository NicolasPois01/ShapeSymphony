import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class MainComponentComponent {

  grid: boolean = false;
  precisionMode: boolean = false;

  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Shift") this.grid = !this.grid;
    else if(event.key === "Control") this.precisionMode = !this.precisionMode;
  }
}
