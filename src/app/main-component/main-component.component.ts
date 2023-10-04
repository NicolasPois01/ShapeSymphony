import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CircleService } from '../services/circle.service';
import { Circle } from '../models/circle';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimerService } from '../services/timer.service';

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

  constructor(private circleService: CircleService, public timerService: TimerService) {}

  ngOnInit() {
    this.circleService.circleList$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((circles: Circle[]) => this.circles = circles); // Ajoutez le type ici
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null); // Ajoutez une valeur ici, même si elle n'est pas utilisée
    this.unsubscribe$.complete();
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Shift") this.grid = !this.grid;
    else if(event.key === "Control") this.precisionMode = !this.precisionMode;
  }
}
