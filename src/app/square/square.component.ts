import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import {TimerService} from "../services/timer.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('square') squareElement: any;
  @ViewChild('arrow') arrow: any;
  @ViewChild('mousebox') mousebox: any;

  circles!: Circle[];

  circleX: number = 0;
  circleY: number = 0;

  velocityX: number = 1.2;
  velocityY: number = 2.6;

  squareSize: number = 600;
  squareUnit: number = 10;

  fps: number = 60;

  mouseDown: boolean = false;
  savePoseX: number = 0;
  savePoseY: number = 0;
  saveAngle: number = 0;
  saveDistance: number = 0;
  saveVx: number = 0;
  saveVy: number = 0;

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

  ngAfterViewInit() {
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
              this.circlesService.collisions.push({x:circle.x, y:circle.y, color: circle.color});
              setTimeout(() => {
                this.circlesService.collisions.shift();
              }, 1000);
          }
          if (!this.circlesService.inRange(circle.y, this.squareUnit)) {
            this.circlesService.bounceY(circle, circle.y - this.circlesService.circleRad < -(this.squareUnit/2), this.squareUnit/2 - this.circlesService.circleRad);
            this.circlesService.collisions.push({x: circle.x, y: circle.y, color: circle.color});

            setTimeout(() => {
              this.circlesService.collisions.shift();
            }, 1000);

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
    let squareSize = this.getSquareSize();
    if(event.target === this.squareElement.nativeElement) {
      x = this.circlesService.getFromMouse(this.savePoseX, this.squareUnit, squareSize);
      y = this.circlesService.getFromMouse(this.savePoseY, this.squareUnit, squareSize);
    } else {
      x = this.circlesService.getFromMouse(this.savePoseX + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.left, this.squareUnit, squareSize);
      y = this.circlesService.getFromMouse(this.savePoseY + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.top, this.squareUnit, squareSize);
    }
    if(!this.circlesService.inRange(x, this.squareUnit) || !this.circlesService.inRange(y, this.squareUnit)) return;
    this.circlesService.addCircle(parseFloat(x.toFixed(event.ctrlKey ? 1 : 2)),parseFloat(y.toFixed(event.ctrlKey ? 1 : 2)), (this.saveVx * this.squareUnit) / squareSize, (this.saveVy * this.squareUnit) / squareSize);
  }


  onSquareMouseMove(event: MouseEvent) {
    let squareSize = this.getSquareSize();
    let x = parseFloat(this.circlesService.getFromMouse(event.offsetX, this.squareUnit, squareSize).toFixed(event.ctrlKey ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(event.offsetY, this.squareUnit, squareSize).toFixed(event.ctrlKey ? 1 : 2));
    this.mousebox.nativeElement.style.left = event.pageX+10 + 'px';
    this.mousebox.nativeElement.style.top = event.pageY+10 + 'px';
    if(this.mouseDown) {
      this.saveVx = parseFloat((event.offsetX - this.savePoseX).toFixed(2));
      this.saveVy = parseFloat((event.offsetY - this.savePoseY).toFixed(2));
      this.saveDistance = parseFloat((Math.sqrt(Math.pow(Math.abs(this.saveVx), 2) + Math.pow(Math.abs(this.saveVy), 2))).toFixed(2));
      this.saveAngle = (360+Math.round(Math.atan2(event.offsetY - this.savePoseY, event.offsetX - this.savePoseX)/Math.PI*180))%360;
      this.mousebox.nativeElement.innerText = ((this.saveDistance * this.squareUnit) / squareSize).toFixed(2) + " m/s";
      this.arrow.nativeElement.style.width = this.saveDistance + "px";
      this.arrow.nativeElement.style.transform = "translateY(calc(-50% + 2.5px)) rotate("+this.saveAngle+"deg)";
    } else {
      this.mousebox.nativeElement.innerText =  x+";"+y;
      this.squareElement.nativeElement.style.setProperty("--left-mouse-percent", (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.squareElement.nativeElement.style.setProperty("--top-mouse-percent", (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.squareElement.nativeElement.style.setProperty("--left-mouse-px", event.offsetX + 'px');
      this.squareElement.nativeElement.style.setProperty("--top-mouse-px", event.offsetY + 'px');

    }
  }

  onSquareMouseDown(event: MouseEvent) {
    this.arrow.nativeElement.style.display = "block";
    this.mouseDown = true;
    this.savePoseX = event.offsetX;
    this.savePoseY = event.offsetY;
  }

  onSquareMouseUp(event: MouseEvent) {
    this.arrow.nativeElement.style.display = "none";
    this.arrow.nativeElement.style.width = "0px";
    this.mouseDown = false;
    let x = parseFloat(this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()).toFixed(event.ctrlKey ? 1 : 2));
    this.mousebox.nativeElement.style.left = event.pageX+10 + 'px';
    this.mousebox.nativeElement.style.top = event.pageY+10 + 'px';
    this.mousebox.nativeElement.innerText =  x+";"+y;
    this.squareElement.nativeElement.style.setProperty("--left-mouse-percent", (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
    this.squareElement.nativeElement.style.setProperty("--top-mouse-percent", (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
    this.squareElement.nativeElement.style.setProperty("--left-mouse-px", event.offsetX + 'px');
    this.squareElement.nativeElement.style.setProperty("--top-mouse-px", event.offsetY + 'px');
  }

  onSquareMouseEnter(event: MouseEvent) {
  }

  onSquareMouseLeave(event: MouseEvent) {
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
