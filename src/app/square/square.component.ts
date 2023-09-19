import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  circleSize: number = 1;
  squareUnit: number = 10;

  fps: number = 60;

  interval: any;

  @ViewChild('square') squareElement: any; 

  constructor(private circlesService: CircleService) {
    this.circles = circlesService.circleList;
  }

  ngOnInit() {
    this.startAnimation();
  }

  getSquareSize() {
    return this.squareElement.nativeElement.offsetWidth;
  }

  startAnimation() {
    this.interval = setInterval(() => {
      for (let circle of this.circles) {
        this.circlesService.updatePos(circle, circle.x + (circle.xSpeed/this.fps), circle.y + (circle.ySpeed/this.fps));

        if (circle.x < 0 || circle.x + this.circleSize > this.squareUnit) {
          this.circlesService.bounceX(circle, circle.x < 0, this.squareUnit - this.circleSize);
        }
        if (circle.y < 0 || circle.y + this.circleSize > this.squareUnit) {
          this.circlesService.bounceY(circle, circle.y < 0, this.squareUnit - this.circleSize);
        }
      }
    }, 1000/this.fps);
  }

  onSquareClick(event: MouseEvent) {
    console.log(event.offsetX, (event?.target as HTMLElement), event.offsetX + (event?.target as HTMLElement)?.getBoundingClientRect().left);
    if(event.target === this.squareElement.nativeElement)
      this.circlesService.addCircle(
        this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()), 
        this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()));
    else
      this.circlesService.addCircle(
        this.circlesService.getFromMouse(event.offsetX + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.left, this.squareUnit, this.getSquareSize()), 
        this.circlesService.getFromMouse(event.offsetY + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.top, this.squareUnit, this.getSquareSize()));
  }

  onSquareMouseMove(event: MouseEvent) {

  }

  onSquareMouseEnter(event: MouseEvent) {

  }

  onSquareMouseLeave(event: MouseEvent) {

  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
