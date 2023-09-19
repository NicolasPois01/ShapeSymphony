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
    let x, y = 0;
    if(event.target === this.squareElement.nativeElement) {
      x = this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()); 
      y = this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize());
    } else {
      x = this.circlesService.getFromMouse(event.offsetX + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.left, this.squareUnit, this.getSquareSize()); 
      y = this.circlesService.getFromMouse(event.offsetY + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.top, this.squareUnit, this.getSquareSize());
    }
    if(x < 0 || y < 0 || x > this.squareUnit - this.circleSize || y > this.squareUnit - this.circleSize) return;
    this.circlesService.addCircle(parseFloat(x.toFixed(event.ctrlKey ? 1 : 2)),parseFloat(y.toFixed(event.ctrlKey ? 1 : 2)));
  }

  onSquareMouseMove(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    mousebox.style.left = event.pageX+10 + 'px';
    mousebox.style.top = event.pageY+10 + 'px';
    mousebox.innerText =  this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2)+";"+
                          this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2)
  }

  onSquareMouseEnter(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    mousebox.style.display = 'block';
  }

  onSquareMouseLeave(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    mousebox.style.display = 'none';
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
