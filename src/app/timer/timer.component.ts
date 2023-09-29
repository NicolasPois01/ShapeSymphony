import { Component, Input } from '@angular/core';
import {TimerService} from "../services/timer.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Input() timerService: TimerService|undefined = undefined;

  constructor() {
  }

  startTimer(): void {
    this.timerService?.start();
  }

  pauseTimer(): void {
    this.timerService?.pause();
  }

  getMinutes(): any {
    return this.timerService?.getMinutes();
  }

  getSecondes(): any {
    return this.timerService?.getSecondes();
  }

  getMillisecondes(): any {
    return this.timerService?.getMillisecondes();
  }

  getIsRunning(): any {
    return this.timerService?.getIsRunning();
  }

}
