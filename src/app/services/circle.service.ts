import {Injectable} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class CircleService {
  circleSize: number = 1;
  circleRad: number = this.circleSize/2;
  private circleChangedSubject: Subject<Circle> = new Subject<Circle>();
  circleChanged$: Observable<Circle> = this.circleChangedSubject.asObservable();
  circleList: Circle[] = [];
  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  notes = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"]
  selectedCircle: Circle | null;
  soundService : SoundService;
  private circleListSubject = new BehaviorSubject<Circle[]>([]);
  circleList$: Observable<Circle[]> = this.circleListSubject.asObservable();

  constructor(soundService : SoundService) {
    this.selectedCircle = null;
    this.soundService = soundService;
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

  updatePos(circle: any, x: number, y: number) {
    circle.x = x;
    circle.y = y;
    this.circleChangedSubject.next(circle);
  }

    bounceX(circle: any, leftBorder: Boolean, midSquareSize: number) {
      this.soundService.playAudio(circle);
      circle.xSpeed = -circle.xSpeed;
      if(leftBorder) {
        circle.x = -(midSquareSize + (circle.x + midSquareSize));
      } else {
        circle.x = midSquareSize - (circle.x - midSquareSize);
      }

    }

    bounceY(circle: any, topBorder: Boolean, midSquareSize: number) {
      this.soundService.playAudio(circle);
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

  getRandomSpeed(): number {
    // Assuming speed range is between -2 and 2.
    return Math.random() * 4 - 2;
  }

  addCircle(x: number, y: number, vX: number, vY: number) {
    const circle: Circle = {
      id: this.circleList.length, // Assuming unique ids based on list length
      x: x,
      y: y,
      xSpeed: vX,
      ySpeed: vY,
      color: this.getRandomColor(),
      startX: x,
      startY: y,
      instrument: this.soundService.activeInstrument,
      note: this.soundService.activeNote,
      alteration: this.soundService.activeAlterationString,
      octave: this.soundService.activeOctave,
      volume: 1,
      maxBounces: 10,
      maxTime: 10000,
      spawnTime: 0,
      isColliding : false
    };

    this.circleList.push(circle);
    this.circleListSubject.next(this.circleList);
  }

  private selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
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

  updateCircleSpeed(circle: Circle) {
    this.selectedCircleSubject.next(circle);
  }
}
