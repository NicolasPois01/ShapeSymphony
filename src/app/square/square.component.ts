import { Component, OnInit, OnDestroy } from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import {TimerService} from "../services/timer.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy {
  circles!: Circle[];

  circleX: number = 0;
  circleY: number = 0;

  velocityX: number = 1.2;
  velocityY: number = 2.6;

  squareSize: number = 600;
  circleSize: number = 20;

  interval: any;

  private subscriptions: Subscription[] = [];

  constructor(private circlesService: CircleService, private timerService: TimerService) {
    this.circles = circlesService.circleList;
    this.subscriptions.push(
      this.timerService.start$.subscribe(() => this.startAnimation()),
      this.timerService.pause$.subscribe(() => this.pauseAnimation())
    );
  }

  ngOnInit() {

  }


  startAnimation() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        for (let circle of this.circles) {
          this.circlesService.updatePos(circle.id, circle.x + circle.xSpeed, circle.y + circle.ySpeed);

          if (circle.x <= 0 || circle.x + this.circleSize >= this.squareSize) {
            this.circlesService.bounceX(circle.id);
          }
          if (circle.y <= 0 || circle.y + this.circleSize >= this.squareSize) {
            this.circlesService.bounceY(circle.id);
          }
        }
      }, 10);
    }
  }

  pauseAnimation(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onSquareClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    this.circlesService.addCircle(x, y);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
