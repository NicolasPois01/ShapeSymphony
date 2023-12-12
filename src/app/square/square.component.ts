import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import {CircleService} from "../services/circle.service";
import {Circle} from "../models/circle";
import {TimerService} from "../services/timer.service";
import {Subscription} from "rxjs";
import {SoundService} from "../services/sound.service";
import {Arena} from "../models/arena";
import {ArenaService} from "../services/arena.service";
import {AnimationService} from "../services/animation.service";

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('square') squareElement: any;
  @ViewChild('arrow') arrow: any;
  @ViewChild('mousebox') mousebox: any;

  @Input() grid: boolean = false;
  @Input() precisionMode: boolean = false;
  @Input() timerService: TimerService|undefined = undefined;
  @Input() fps: number = 30;
  @Input() squareUnit: number = 10;
  @Input() arena!: Arena;

  circles!: Circle[];

  circleX: number = 0;
  circleY: number = 0;

  velocityX: number = 1.2;
  velocityY: number = 2.6;

  squareSize: number = 600;

  mouseDown: boolean = false;
  savePoseX: number = 0;
  savePoseY: number = 0;
  saveAngle: number = 0;
  saveDistance: number = 0;
  saveVx: number = 0;
  saveVy: number = 0;
  currentPosX: number = 0;
  currentPosY: number = 0;
  timestamp: any = 0;

  interval: any;

  subscriptions: Subscription[] = [];
  offset = 0
  constructor(private circlesService: CircleService,
              private soundService: SoundService,
              private arenaService: ArenaService,
              private animationService: AnimationService) {
    arenaService.activeArenaSubject.subscribe(arena => this.circles = arena.circleListAlive);
  }

  ngOnInit() {
    this.soundService?.loadAudioFiles();
    this.animationService.isAnimationRunning$.subscribe(isRunning => {
      if (isRunning && this.timerService?.getIsRunning()) {
        this.interval = setInterval(() => {
          let elapsedTime = ((this.timerService?.getTimeStamp() ?? 0) - this.timestamp) / 1000;
          this.timestamp = this.timerService?.getTimeStamp();
          if (elapsedTime > 0){
            this.arenaService.updateArenas(elapsedTime, this.timestamp, this.squareUnit );
          }
        }, 1000 / this.fps);
      }
      else {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }
    });
  }

  ngAfterViewInit() {
  }

  getSquareSize() {
    return this.squareElement?.nativeElement.offsetWidth ?? 0;
  }

  startAnimation() {
    this.animationService.startAnimation();
  }

  pauseAnimation(): void {
    this.animationService.pauseAnimation();
  }

  onSquareClick(event: MouseEvent) {
    if(this.soundService === undefined) return;
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

    let spawnTimeValue: number = this.timerService ? this.timerService.getTimeStamp() : 0;
    let circle: Circle = {
      id: this.circlesService.getNewId(),
      x: parseFloat(x.toFixed(this.precisionMode ? 1 : 2)),
      y: parseFloat(y.toFixed(this.precisionMode ? 1 : 2)),
      xSpeed: parseFloat(((this.saveVx * this.squareUnit) / squareSize).toFixed(this.precisionMode ? 1 : 2)),
      ySpeed: parseFloat(((this.saveVy * this.squareUnit) / squareSize).toFixed(this.precisionMode ? 1 : 2)),
      color: this.circlesService.getRandomColor(),
      startX: parseFloat(x.toFixed(this.precisionMode ? 1 : 2)),
      startY: parseFloat(y.toFixed(this.precisionMode ? 1 : 2)),
      startXSpeed: parseFloat(((this.saveVx * this.squareUnit) / squareSize).toFixed(this.precisionMode ? 1 : 2)),
      startYSpeed: parseFloat(((this.saveVy * this.squareUnit) / squareSize).toFixed(this.precisionMode ? 1 : 2)),
      instrument: this.soundService.activeInstrumentSubject.getValue(),
      note: this.soundService.activeNoteSubject.getValue(),
      alteration: this.soundService.activeAlterationStringSubject.getValue(),
      octave: this.soundService.activeOctaveSubject.getValue(),
      volume: this.soundService.activeVolumeSubject.getValue(),
      spawnTime: spawnTimeValue,
      maxBounces: 0,
      maxTime: 0,
      nbBounces: 0,
      showable: true,
      contactPoint: {x: -1, y: -1},
      isColliding: false
    }
    this.circlesService.addCircleToAliveList(circle);
  }


  onSquareMouseMove(event: MouseEvent, dispatched: boolean = false) {
    this.currentPosX = !dispatched ? event.offsetX : this.currentPosX;
    this.currentPosY = !dispatched ? event.offsetY : this.currentPosY;
    let squareSize = this.getSquareSize();
    let x = parseFloat(this.circlesService.getFromMouse(this.currentPosX, this.squareUnit, squareSize).toFixed(this.precisionMode ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(this.currentPosY, this.squareUnit, squareSize).toFixed(this.precisionMode ? 1 : 2));
    this.mousebox.nativeElement.style.left = this.currentPosX+this.squareElement.nativeElement.getBoundingClientRect().left+10 + 'px';
    this.mousebox.nativeElement.style.top = this.currentPosY+this.squareElement.nativeElement.getBoundingClientRect().top+10 + 'px';
    if(this.mouseDown) {
      this.saveVx = parseFloat((this.currentPosX - this.savePoseX).toFixed(this.precisionMode ? 1 : 2));
      this.saveVy = parseFloat((this.currentPosY - this.savePoseY).toFixed(this.precisionMode ? 1 : 2));
      this.saveDistance = parseFloat((Math.sqrt(Math.pow(Math.abs(this.saveVx), 2) + Math.pow(Math.abs(this.saveVy), 2))).toFixed(this.precisionMode ? 1 : 2));
      this.saveAngle = (360-Math.round(Math.atan2(this.saveVy, this.saveVx)/Math.PI*180))%360;
      this.mousebox.nativeElement.innerHTML = ((this.saveDistance * this.squareUnit) / squareSize).toFixed(this.precisionMode ? 1 : 2) + " m/s <br/> "+this.saveAngle+" °";
      this.arrow.nativeElement.style.width = this.saveDistance + "px";
      this.arrow.nativeElement.style.transform = "translateY(calc(-50% + 2.5px)) rotate("+(-this.saveAngle)+"deg)";
    } else {
      this.mousebox.nativeElement.innerText =  x+";"+y;
      this.squareElement.nativeElement.style.setProperty("--left-mouse-percent", (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.squareElement.nativeElement.style.setProperty("--top-mouse-percent", (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.squareElement.nativeElement.style.setProperty("--left-mouse-px", (this.currentPosX+this.squareElement.nativeElement.getBoundingClientRect().left) + 'px');
      this.squareElement.nativeElement.style.setProperty("--top-mouse-px", (this.currentPosY+this.squareElement.nativeElement.getBoundingClientRect().top) + 'px');
    }
  }

  onSquareMouseDown(event: MouseEvent) {
    this.arrow.nativeElement.style.display = "block";
    this.mouseDown = true;
    let demiCircleSize = ((this.getCircleSize()/2) * this.getSquareSize()) / this.squareUnit;
    this.savePoseX = event.offsetX < demiCircleSize ? demiCircleSize : (event.offsetX > this.getSquareSize() - demiCircleSize ? this.getSquareSize() - demiCircleSize : event.offsetX);
    this.savePoseY = event.offsetY < demiCircleSize ? demiCircleSize : (event.offsetY > this.getSquareSize() - demiCircleSize ? this.getSquareSize() - demiCircleSize : event.offsetY);
    this.squareElement.nativeElement.style.setProperty("--left-mouse-px", (this.savePoseX + this.squareElement.nativeElement.getBoundingClientRect().left) + 'px');
    this.squareElement.nativeElement.style.setProperty("--top-mouse-px", (this.savePoseY + this.squareElement.nativeElement.getBoundingClientRect().top) + 'px');
    document.body.classList.add("unselectable");
    this.saveAngle = 0;
    this.saveVx = 0;
    this.saveVy = 0;
    this.mousebox.nativeElement.innerHTML = "0 m/s <br/> 0°";
  }

  onSquareMouseUp(event: MouseEvent) {
    this.arrow.nativeElement.style.display = "none";
    this.arrow.nativeElement.style.width = "0px";
    this.mouseDown = false;
    document.body.classList.remove("unselectable");
    let x = parseFloat(this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()).toFixed(this.precisionMode ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()).toFixed(this.precisionMode ? 1 : 2));
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

  getCircleSize(): number {
    return this.circlesService.circleSize;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.mousebox) this.onSquareMouseMove(new MouseEvent("mousemove"), true );
    if (changes['arena']) {
      this.circles = this.arena.circleListAlive;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
