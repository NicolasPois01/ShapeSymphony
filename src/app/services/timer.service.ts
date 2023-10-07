import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  minutes: number = 0;
  seconds: number = 0;
  milliseconds: number = 0;
  elapsedTime = 0; // total time that has elapsed in milliseconds
  startTime: any;
  isRunning: boolean = false;
  timer: any;

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      // Adjust the start time based on previously elapsed time
      this.startTime = Date.now() - this.elapsedTime;
      let self = this;

      if (!this.timer) {
        this.timer = setInterval(() => {
          self.elapsedTime = Date.now() - self.startTime;

          self.milliseconds = self.elapsedTime % 1000;
          self.seconds = Math.floor(self.elapsedTime / 1000) % 60;
          self.minutes = Math.floor(self.elapsedTime / 60000);
        }, 10);
      }
    }
  }

  // Ajouter cette méthode dans TimerService
  resetTimer(): void {
    this.pause();
    this.elapsedTime = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
  }


  pause(): void {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  getTime(): object {
    return {'minutes': this.minutes,'secondes': this.seconds,'millisecondes':  this.milliseconds}
  }

  isTimerNotStarted() {
    return this.minutes === 0 && this.seconds === 0 && this.milliseconds === 0;
  }

  getMinutes(): number {
    return this.minutes;
  }

  getSecondes(): number {
    return this.seconds;
  }

  getMillisecondes(): number {
    return this.milliseconds;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getTimeStamp(): number {
    return ( this.minutes * 60000 ) + ( this.seconds * 1000 ) + this.milliseconds;
  }
}
