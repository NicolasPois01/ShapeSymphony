import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-arena-option',
  templateUrl: './arena-option.component.html',
  styleUrls: ['./arena-option.component.scss']
})
export class ArenaOptionComponent {

  @Output() public onFPSChange: EventEmitter<any> = new EventEmitter();
  @Output() public onModeChange: EventEmitter<any> = new EventEmitter();

  mode = 'Normal';
  fps = 60;

  constructor() { }

  changeMode() {
    switch (this.mode) {
      case 'Normal':
        this.mode = 'No Effects';
        break;
      case 'No Effects':
        this.mode = 'No Circles';
        break;
      default:
        this.mode = 'Normal';
    }
    this.onModeChange.emit(this.mode);
  }

  changeFPS() {
    switch (this.fps) {
      case 60:
        this.fps = 30;
        break;
      case 30:
        this.fps = 15;
        break;
      default:
        this.fps = 60;
        break;
    }
    this.onFPSChange.emit(this.fps);
  }

  getIconName() {
    switch (this.mode) {
      case 'Normal':
        return 'circle';
      case 'No Effects':
        return 'star-off';
      default:
        return 'circle-off';
    }
  }
}
