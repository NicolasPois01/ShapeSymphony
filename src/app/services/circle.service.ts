import {Injectable} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SoundService} from "./sound.service";
import cloneDeep from 'lodash/cloneDeep'
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class CircleService {
  circleSize: number = 1;
  circleRad: number = this.circleSize/2;
  circleChangedSubject: Subject<Circle> = new Subject<Circle>();
  circleChanged$: Observable<Circle> = this.circleChangedSubject.asObservable();
  newCircleSubject: Subject<Circle> = new Subject<Circle>();
  newCircle$ = this.newCircleSubject.asObservable();
  circleList: Circle[] = [];
  tempCircleList: Circle[] = [];

  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  soundService : SoundService;
  timerService: TimerService;
  notes: string[] = [];
  alterations: string[] = [];
  octaves: string[] = [];
  highestId: number = 0;
  circleListSubject = new BehaviorSubject<Circle[]>([]);
  circleList$: Observable<Circle[]> = this.circleListSubject.asObservable();
  selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  constructor(soundService : SoundService, timerService: TimerService) {
    this.selectedCircle = null;
    this.soundService = soundService;
    this.timerService = timerService;
    this.notes = this.soundService.notes;
    this.alterations = this.soundService.alterations;
    this.octaves = this.soundService.octaves;
  }

  getFromMouse(pos: number, squareUnit: number, squareSize: number): number {
    let ret: number = (pos * squareUnit / squareSize) - squareUnit / 2;
    if(ret > squareUnit / 2 - this.circleRad) ret = squareUnit/2 - this.circleRad;
    else if(ret < -(squareUnit / 2 - this.circleRad)) ret = -(squareUnit/2 - this.circleRad);
    return ret;
  }

  inRange(pos: number, squareUnit: number): boolean {
    return pos + (squareUnit/2) >= this.circleRad && pos <= (squareUnit/2) - this.circleRad;
  }

  clearAllCircles(): void {
    while(this.circleList.length > 0) {
      this.deleteCircle(this.circleList[0]);
    }
  }

  updatePos(circle: any, x: number, y: number) {
    circle.x = x;
    circle.y = y;
    this.circleChangedSubject.next(circle);
  }

  calculatePos(elapsedTime: number, circle: Circle, squareUnit: number, offSet: number, isArenaMuted: boolean) {
    // Update the circle's position based on its speed and elapsed time
    circle.x += circle.xSpeed * elapsedTime;
    circle.y += circle.ySpeed * elapsedTime;
    this.updatePos(circle, circle.x, circle.y);

    // Collides x
    if (!this.inRange(circle.x, squareUnit)) {
      circle.isColliding = true;
      circle.nbBounces += 1;
      let adjustedX = circle.xSpeed > 0 ? circle.x + this.circleRad - offSet : circle.x - this.circleRad + offSet;
      circle.contactPoint = { x: adjustedX, y: circle.y };
      this.bounceX(circle, circle.x - this.circleRad < -(squareUnit / 2),
        squareUnit / 2 - this.circleRad, isArenaMuted)
      setTimeout(() => {
        circle.isColliding = false;
      }, 500);
    }

    // Collides y
    if (!this.inRange(circle.y, squareUnit)) {
      circle.isColliding = true;
      circle.nbBounces += 1;
      let adjustedY = circle.ySpeed > 0 ? circle.y + this.circleRad - offSet : circle.y - this.circleRad + offSet;
      circle.contactPoint = {x: circle.x, y: adjustedY};
      this.bounceY(circle, circle.y - this.circleRad < -(squareUnit / 2),
        squareUnit / 2 - this.circleRad, isArenaMuted);
      setTimeout(() => {
        circle.isColliding = false;
      }, 500);
    }
    if(circle.maxBounces != 0 && circle.nbBounces >= circle.maxBounces) {
      circle.showable = false;
    }

    this.circleChangedSubject.next(circle);
  }

  bounceX(circle: any, leftBorder: Boolean, midSquareSize: number, isArenaMuted: boolean) {
    if (!isArenaMuted) {
      this.soundService.playAudio(circle);
    }
    circle.xSpeed = -circle.xSpeed;
    if(leftBorder) {
      circle.x = -(midSquareSize + (circle.x + midSquareSize));
    } else {
      circle.x = midSquareSize - (circle.x - midSquareSize);
    }

    }

  bounceY(circle: any, topBorder: Boolean, midSquareSize: number, isArenaMuted: boolean) {
    if (!isArenaMuted) {
      this.soundService.playAudio(circle);
    }
    circle.ySpeed = -circle.ySpeed;
    if(topBorder) {
      circle.y = -(midSquareSize + (circle.y + midSquareSize));
    } else {
      circle.y = midSquareSize - (circle.y - midSquareSize);
    }
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  getNewId(): number {
    return this.highestId++;
  }

  addCircleToActiveArena(circle: Circle) {
    this.circleList.push(circle);
    this.circleListSubject.next(this.circleList);
    this.newCircleSubject.next(circle);
  }

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
    console.log(JSON.stringify(this.selectedCircleSubject.getValue()));
    this.selectedCircle = this.selectedCircleSubject.getValue();
  }

  deleteCircle(circle: Circle): void {
    const index = this.circleList.indexOf(circle);
    if (index > -1) {
      this.circleList.splice(index, 1);
      this.circleListSubject.next(this.circleList);  // Notifier le changement
    }
  }

  saveCircles(): void {
    this.tempCircleList = cloneDeep(this.circleList); // deepClone pour copier les objets et non les références
  }

  restoreCircles(): void {
    this.clearAllCircles();  // This will clear the current circles

    this.tempCircleList.forEach(circle => {
      this.addCircleToActiveArena(circle);
    });
  }

  setColor(color: string | undefined) {
    if (this.selectedCircle) {
      if (color != null) {
        this.selectedCircle.color = color;
      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  setNote(note: string | undefined) {
    if (this.selectedCircle) {
      if (note != null) {
        this.selectedCircle.note = note;
      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  setMaxBounces(maxBounces: number) {
    if (this.selectedCircle) {
      this.selectedCircle.maxBounces = maxBounces;
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  updateCircleSpeed(circle: Circle) {
    this.selectedCircleSubject.next(circle);
  }

  setAlteration(alteration: string | undefined) {
    if (this.selectedCircle) {
      if (alteration != null) {
        this.selectedCircle.alteration = alteration;
      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  setOctave(octave: number | undefined) {
    if (this.selectedCircle) {
      if (octave != null) {
        this.selectedCircle.octave = octave;
      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  resetCircles(): void {
    this.circleList.forEach(circle => {
      circle.x = circle.startX;
      circle.y = circle.startY;
      circle.xSpeed = circle.startXSpeed;
      circle.ySpeed = circle.startYSpeed;
      circle.nbBounces = 0;
      circle.showable = true;
    });
    this.circleListSubject.next(this.circleList);
  }
}