import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CircleService } from "../services/circle.service";
import { Circle } from "../models/circle";
import { TimerService } from "../services/timer.service";
import { Subscription } from "rxjs";
import { SoundService } from "../services/sound.service";
import { Arena } from "../models/arena";
import { ArenaService } from "../services/arena.service";
import { AnimationService } from "../services/animation.service";
import { Percussions } from '../models/percussionEnum';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('square') squareElement: any;
  @ViewChild('containerSquareElements') containerSquareElements: any;
  @ViewChild('arrow') arrow: any;
  @ViewChild('mousebox') mousebox: any;

  @Input() grid: boolean = false;
  @Input() precisionMode: boolean = false;
  @Input() timerService: TimerService|undefined = undefined;
  @Input() fps: number = 30;
  @Input() squareUnit: number = 10;
  @Input() arena!: Arena;

  ctx!: CanvasRenderingContext2D;

  circles!: Circle[];

  circleX: number = 0;
  circleY: number = 0;

  velocityX: number = 1.2;
  velocityY: number = 2.6;

  squareSize: number = 600;
  squareCanvasSize: number = 600;
  midSquareSize = this.squareUnit/2;

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
  canvasInvisible!: CanvasRenderingContext2D;

  interval: any;

  subscriptions: Subscription[] = [];
  constructor(private circlesService: CircleService,
              private soundService: SoundService,
              private arenaService: ArenaService,
              private animationService: AnimationService) {
    arenaService.activeArenaSubject.subscribe(arena => {
      this.circles = arena.circleListAlive;
      this.draw();
    });
  }

  ngOnInit() {
    this.soundService?.loadAudioFiles();
    this.animationService.isAnimationRunning$.subscribe(isRunning => {
      if (isRunning && this.timerService?.getIsRunning()) {
        this.interval = setInterval(() => {
          let time = this.timerService?.getTimeStamp() ?? 0;
          let elapsedTime = (time - this.timestamp) / 1000;
          if(elapsedTime > 0.1) console.log(elapsedTime);
          this.timestamp = time;
          if (elapsedTime > 0){
            this.arenaService.updateArenas(elapsedTime, this.timestamp, this.squareUnit);
            this.draw();
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
    this.ctx = this.squareElement.nativeElement.getContext("2d");
    let canvasInvisible = document.createElement('canvas');
    canvasInvisible.width = this.squareCanvasSize;
    canvasInvisible.height = this.squareCanvasSize;
    let ctxInvisible = canvasInvisible.getContext("2d");
    if(ctxInvisible !== null) {
      this.canvasInvisible = ctxInvisible;
    }
    this.canvasInvisible.lineWidth = 3;
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

  onSquareClick(event: PointerEvent) {
    if(this.soundService === undefined) return;
    let x, y = 0;
    let squareSize = this.getSquareSize();
    if(event.target === this.containerSquareElements.nativeElement) {
      x = this.circlesService.getFromMouse(this.savePoseX, this.squareUnit, squareSize);
      y = this.circlesService.getFromMouse(this.savePoseY, this.squareUnit, squareSize);
    } else {
      x = this.circlesService.getFromMouse(this.savePoseX + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.left, this.squareUnit, squareSize);
      y = this.circlesService.getFromMouse(this.savePoseY + ((event?.target as HTMLElement)?.parentElement as HTMLElement)?.getBoundingClientRect()?.top, this.squareUnit, squareSize);
    }
    if(!this.circlesService.inRange(x, this.squareUnit) || !this.circlesService.inRange(y, this.squareUnit)) return;

    let spawnTimeValue: number = this.timerService ? this.timerService.getTimeStamp() : 0;
    let instrument = this.soundService.activeInstrumentSubject.getValue();
    let note = this.soundService.activeNoteSubject.getValue();
    let alteration = this.soundService.activeAlterationStringSubject.getValue();
    let octave = this.soundService.activeOctaveSubject.getValue();
    let volume = this.soundService.activeVolumeSubject.getValue();
    let audioFilePath = "";
    if (Object.values(Percussions).includes(instrument as Percussions)) {
      let audioFileName = instrument+'.mp3';
      audioFilePath = `./assets/samples/Percussion/${audioFileName}`;
    } else {
      let audioFileName = instrument+note+alteration+octave+'.mp3';
      audioFilePath = `./assets/samples/${instrument}/${audioFileName}`;
    }
    const audio = new Audio(audioFilePath);
    audio.volume = (volume/100);
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
      instrument: instrument,
      note: note,
      alteration: alteration,
      octave: octave,
      volume: volume,
      spawnTime: spawnTimeValue,
      maxBounces: 0,
      maxTime: 0,
      nbBounces: 0,
      showable: true,
      contactPoint: {x: -1, y: -1},
      isColliding: false,
      audio: audio
    }
    this.circlesService.addCircleToAliveList(circle);
  }


  onSquareMouseMove(event: PointerEvent, dispatched: boolean = false) {
    this.currentPosX = !dispatched ? event.offsetX : this.currentPosX;
    this.currentPosY = !dispatched ? event.offsetY : this.currentPosY;
    let squareSize = this.getSquareSize();
    let x = parseFloat(this.circlesService.getFromMouse(this.currentPosX, this.squareUnit, squareSize).toFixed(this.precisionMode ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(this.currentPosY, this.squareUnit, squareSize).toFixed(this.precisionMode ? 1 : 2));
    this.mousebox.nativeElement.style.left = this.currentPosX+this.containerSquareElements.nativeElement.getBoundingClientRect().left+10 + 'px';
    this.mousebox.nativeElement.style.top = this.currentPosY+this.containerSquareElements.nativeElement.getBoundingClientRect().top+10 + 'px';
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
      this.containerSquareElements.nativeElement.style.setProperty("--left-mouse-percent", (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.containerSquareElements.nativeElement.style.setProperty("--top-mouse-percent", (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
      this.containerSquareElements.nativeElement.style.setProperty("--left-mouse-px", (this.currentPosX+this.containerSquareElements.nativeElement.getBoundingClientRect().left) + 'px');
      this.containerSquareElements.nativeElement.style.setProperty("--top-mouse-px", (this.currentPosY+this.containerSquareElements.nativeElement.getBoundingClientRect().top) + 'px');
    }
  }

  onSquarePointerDown(event: PointerEvent) {
    this.arrow.nativeElement.style.display = "block";
    this.mouseDown = true;
    let demiCircleSize = ((this.getCircleSize()/2) * this.getSquareSize()) / this.squareUnit;
    this.savePoseX = event.offsetX < demiCircleSize ? demiCircleSize : (event.offsetX > this.getSquareSize() - demiCircleSize ? this.getSquareSize() - demiCircleSize : event.offsetX);
    this.savePoseY = event.offsetY < demiCircleSize ? demiCircleSize : (event.offsetY > this.getSquareSize() - demiCircleSize ? this.getSquareSize() - demiCircleSize : event.offsetY);
    this.containerSquareElements.nativeElement.style.setProperty("--left-mouse-px", (this.savePoseX + this.containerSquareElements.nativeElement.getBoundingClientRect().left) + 'px');
    this.containerSquareElements.nativeElement.style.setProperty("--top-mouse-px", (this.savePoseY + this.containerSquareElements.nativeElement.getBoundingClientRect().top) + 'px');
    document.body.classList.add("unselectable");
    this.saveAngle = 0;
    this.saveVx = 0;
    this.saveVy = 0;
    this.mousebox.nativeElement.innerHTML = "0 m/s <br/> 0°";
    this.containerSquareElements.nativeElement.setPointerCapture(event.pointerId);
  }

  onSquarePointerUp(event: PointerEvent) {
    this.arrow.nativeElement.style.display = "none";
    this.arrow.nativeElement.style.width = "0px";
    this.mouseDown = false;
    document.body.classList.remove("unselectable");
    let x = parseFloat(this.circlesService.getFromMouse(event.offsetX, this.squareUnit, this.getSquareSize()).toFixed(this.precisionMode ? 1 : 2));
    let y = parseFloat(this.circlesService.getFromMouse(event.offsetY, this.squareUnit, this.getSquareSize()).toFixed(this.precisionMode ? 1 : 2));
    this.mousebox.nativeElement.style.left = event.pageX+10 + 'px';
    this.mousebox.nativeElement.style.top = event.pageY+10 + 'px';
    this.mousebox.nativeElement.innerText =  x+";"+y;
    this.containerSquareElements.nativeElement.style.setProperty("--left-mouse-percent", (x + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
    this.containerSquareElements.nativeElement.style.setProperty("--top-mouse-percent", (y + (this.squareUnit/2 - this.circlesService.circleRad))*10 + '%');
    this.containerSquareElements.nativeElement.style.setProperty("--left-mouse-px", event.offsetX + 'px');
    this.containerSquareElements.nativeElement.style.setProperty("--top-mouse-px", event.offsetY + 'px');
    this.containerSquareElements.nativeElement.releasePointerCapture(event.pointerId);
    this.onSquareClick(event);
  }

  onSquareMouseDown( event: MouseEvent) {
  }

  onSquareMouseUp( event: MouseEvent) {
  }

  getCircleSize(): number {
    return this.circlesService.circleSize;
  }

  async draw() {
    if(this.squareElement === undefined) return;
    this.ctx.clearRect(0, 0, this.squareCanvasSize, this.squareCanvasSize);
    this.canvasInvisible.clearRect(0, 0, this.squareCanvasSize, this.squareCanvasSize);
    for(let circle of this.circles) {
      this.canvasInvisible.beginPath();
      this.canvasInvisible.strokeStyle = circle.color;
      this.canvasInvisible.arc(((circle.x + this.midSquareSize)*this.squareCanvasSize)/(2*this.midSquareSize), ((circle.y + this.midSquareSize)*this.squareCanvasSize)/(2*this.midSquareSize), (this.getCircleSize()*this.squareCanvasSize)/(this.squareUnit*2), 0, 2 * Math.PI);
      this.canvasInvisible.stroke();
    }
    this.ctx.drawImage(this.canvasInvisible.canvas, 0, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.mousebox) this.onSquareMouseMove(new PointerEvent("mousemove"), true );
    if (changes['arena']) {
      this.circles = this.arena.circleListAlive;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
