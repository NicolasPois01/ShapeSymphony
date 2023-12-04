import { Component, Input } from '@angular/core';
import {TimerService} from "../services/timer.service";
import {CircleService} from "../services/circle.service";
import {ArenaService} from "../services/arena.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Input() timerService: TimerService|undefined = undefined;

  constructor(private circleService: CircleService,
              private arenaService: ArenaService) {
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

  clearAll(): void {
    this.arenaService.clearAll();
    this.timerService?.resetTimer();
  }

  clearActive() {
    this.arenaService.clearActiveArena();
  }

  resetGame(): void {
    this.timerService?.resetTimer();  // réinitialise le timer
    this.arenaService.restoreArenas();  // réinitialise les cercles
  }

}
