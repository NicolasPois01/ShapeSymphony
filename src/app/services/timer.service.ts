import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

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
  showTimer: boolean = true;

  private isRunningSubject = new BehaviorSubject<boolean>(false);
  isRunning$ = this.isRunningSubject.asObservable();

  start(showTimer?: boolean): boolean {
    if (!this.isRunning) {
      if (showTimer == false) {
        this.showTimer = false;
      }
      this.isRunning = true;
      // Adjust the start time based on previously elapsed time
      this.startTime = Date.now() - this.elapsedTime;

      if (!this.timer) {
        this.timer = setInterval(() => {
          this.elapsedTime = Date.now() - this.startTime;

          this.milliseconds = this.elapsedTime % 1000;
          this.seconds = Math.floor(this.elapsedTime / 1000) % 60;
          this.minutes = Math.floor(this.elapsedTime / 60000);

        }, 10);
      }
      this.isRunningSubject.next(true);
    }
    return this.isRunning;
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
    this.isRunningSubject.next(false);
  }

  getTime(): object {
    return {'minutes': this.minutes,'secondes': this.seconds,'millisecondes':  this.milliseconds}
  }

  getShowTimer(): boolean {
    return this.showTimer;
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
