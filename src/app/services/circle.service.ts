import {Injectable} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject} from "rxjs";
import {SoundService} from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class CircleService {

  circleSize: number = 1;
  circleRad: number = this.circleSize/2;

  circleList: Circle[] = [];
  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  soundService : SoundService;

  constructor(soundService : SoundService) {
    this.selectedCircle = null;
    this.soundService = soundService;
  }
  public collisions: { x: number, y: number, color: string }[] = [];

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
      maxBounces: 10,
      maxTime: 10000,
      spawnTime: 0
    };

    this.circleList.push(circle);
  }

  private selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
  }
}
