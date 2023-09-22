import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
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
  @ViewChild('square') squareElement: any;

  circles!: Circle[];

  circleX: number = 0;
  circleY: number = 0;

  velocityX: number = 1.2;
  velocityY: number = 2.6;

  squareSize: number = 600;
  squareUnit: number = 10;

  fps: number = 60;

  interval: any;

  @Input() grid: boolean = false;

  circlesService: CircleService

  timerService: TimerService

  private subscriptions: Subscription[] = [];
  constructor(circlesService: CircleService, timerService: TimerService) {
    this.circlesService = circlesService;
    this.timerService = timerService;
    this.circles = circlesService.circleList;
    this.subscriptions.push(
      this.timerService.start$.subscribe(() => this.startAnimation()),
      this.timerService.pause$.subscribe(() => this.pauseAnimation())
    );
  }

  ngOnInit() {

  }

  getSquareSize() {
    return this.squareElement?.nativeElement.offsetWidth ?? 0;
  }

  startAnimation() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        for (let circle of this.circles) {
          this.circlesService.updatePos(circle, circle.x + (circle.xSpeed/this.fps), circle.y + (circle.ySpeed/this.fps));

          if (!this.circlesService.inRange(circle.x, this.squareUnit)) {
            this.circlesService.bounceX(circle, circle.x - this.circlesService.circleRad < -(this.squareUnit/2), this.squareUnit/2 - this.circlesService.circleRad);
          }
          if (!this.circlesService.inRange(circle.y, this.squareUnit)) {
            this.circlesService.bounceY(circle, circle.y - this.circlesService.circleRad < -(this.squareUnit/2), this.squareUnit/2 - this.circlesService.circleRad);
          }
        }
      }, 1000/this.fps);
    }
  }

  pauseAnimation(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
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
    if(!this.circlesService.inRange(x, this.squareUnit) || !this.circlesService.inRange(y, this.squareUnit)) return;
    this.circlesService.addCircle(parseFloat(x.toFixed(event.ctrlKey ? 1 : 2)),parseFloat(y.toFixed(event.ctrlKey ? 1 : 2)));
  }

  onSquareMouseMove(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    let x = parseFloat(this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2));
    mousebox.style.left = event.pageX+10 + 'px';
    mousebox.style.top = event.pageY+10 + 'px';
    mousebox.innerText =  x+";"+y;

    let previsualisation = document.querySelector('.previs') as HTMLElement;
    previsualisation.style.left = (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%';
    previsualisation.style.top = (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%';
  }

  onSquareMouseEnter(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    mousebox.style.display = 'block';
    let previsualisation = document.querySelector('.previs') as HTMLElement;
    previsualisation.style.display = 'block';
  }

  onSquareMouseLeave(event: MouseEvent) {
    let mousebox = document.querySelector('.mousebox') as HTMLElement;
    mousebox.style.display = 'none';
    let previsualisation = document.querySelector('.previs') as HTMLElement;
    previsualisation.style.display = 'none';
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
