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
  elapsedTime = 0; // total time that has elapsed in milliseconds
  startTime: any;

  constructor(private timerService: TimerService) {
  }

  startTimer(): void {
    if (!this.isRunning) {
      this.isRunning = true;

      // Adjust the start time based on previously elapsed time
      this.startTime = Date.now() - this.elapsedTime;

      this.timerService.start();

      if (!this.timer) {
        this.timer = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;

          this.milliseconds = this.elapsedTime % 1000;
          this.seconds = Math.floor(this.elapsedTime / 1000) % 60;
          this.minutes = Math.floor(this.elapsedTime / 60000);
        }, 10);
      }
    }
  }

  pauseTimer(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.timerService.pause();
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

}
