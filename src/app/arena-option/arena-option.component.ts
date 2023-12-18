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
  fps = '60fps';

  constructor() {}

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
      case '60fps':
        this.fps = '30fps';
        break;
      case '30fps':
        this.fps = '15fps';
        break;
      default:
        this.fps = '60fps';
        break;
    }
    this.onFPSChange.emit(this.fps);
  }

  getIconName() {
    switch (this.mode) {
      case 'Normal':
        return 'circle';
      case 'No Effects':
        return 'eye-off';
      default:
        return 'circle-off';
    }
  }
}
