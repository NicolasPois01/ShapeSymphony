import { Component } from '@angular/core';
import {TimerService} from "../services/timer.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {
  minutes: number = 0;
  seconds: number = 0;
  milliseconds: number = 0;
  timer: any;
  isRunning: boolean = false;

  constructor(private timerService: TimerService) {
  }

  startTimer(): void {
    this.isRunning = true;
    this.timerService.start();
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.milliseconds += 1;
        if (this.milliseconds >= 100) {
          this.seconds++;
          this.milliseconds = 0;
        }
        if (this.seconds >= 60) {
          this.minutes++;
          this.seconds = 0;
        }
      }, 1);
    }
  }

  pauseTimer(): void {
    this.isRunning = false;
    this.timerService.pause();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
