import { Component, Input } from '@angular/core';
import {TimerService} from "../services/timer.service";
import {CircleService} from "../services/circle.service";
import {ArenaService} from "../services/arena.service";
import {AnimationService} from "../services/animation.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Input() timerService: TimerService|undefined = undefined;

  constructor(private circleService: CircleService,
              private arenaService: ArenaService,
              private animationService: AnimationService) {
  }

  startTimer(): void {
    this.timerService?.start();
    this.animationService.startAnimation();
  }

  pauseTimer(): void {
    this.timerService?.pause();
    this.animationService.pauseAnimation();
  }

  getMinutes(): any {
    return this.timerService?.getMinutes();
  }

  getShowTimer(): any {
    return this.timerService?.getShowTimer();
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

  resetGame(): void {
    this.timerService?.resetTimer();  // réinitialise le
    this.animationService.pauseAnimation();  // arrête l'animation
    this.arenaService.restoreArenas();  // réinitialise les cercles

  }

}
