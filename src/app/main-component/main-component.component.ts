import { Component, OnInit, OnDestroy } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimerService } from '../services/timer.service';
import { Arena } from "../models/arena";
import { ArenaService } from "../services/arena.service";
import {SoundService} from "../services/sound.service";

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  },
  providers: [ TimerService ]
})
export class MainComponentComponent implements OnInit, OnDestroy {

  grid: boolean = false;
  precisionMode: boolean = false;
  circles: Circle[] = [];
  private unsubscribe$ = new Subject();

  fps: number = 60;
  squareUnit: number = 10;

  activeArena!: Arena;
  activeInstrument!: string;

  constructor(private circleService: CircleService,
              private arenaService: ArenaService,
              public timerService: TimerService,
              private soundService: SoundService) {}

  ngOnInit() {
    this.circleService.circleListAlive$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((circles: Circle[]) => this.circles = circles); // Ajoutez le type ici
    this.arenaService.activeArena$.subscribe(arena => {
      this.activeArena = arena;
    })
    this.soundService.activeInstrument$.subscribe(instru => this.activeInstrument = instru)
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null); // Ajoutez une valeur ici, même si elle n'est pas utilisée
    this.unsubscribe$.complete();
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Shift") this.grid = !this.grid;
    else if(event.key === "Control") this.precisionMode = !this.precisionMode;
  }

  isPercussion (instrument: string): boolean {
    return this.soundService.isPercussion(instrument);
  }
}
