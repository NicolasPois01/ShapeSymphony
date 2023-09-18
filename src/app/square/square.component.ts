import { Component, OnInit, OnDestroy } from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";

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

  constructor(private circlesService: CircleService) {
    this.circles = circlesService.circleList;
  }

  ngOnInit() {
    this.startAnimation();
  }

  startAnimation() {
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

  onSquareClick(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    this.circlesService.addCircle(x, y);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
