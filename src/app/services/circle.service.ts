import {Injectable} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SoundService} from "./sound.service";
import cloneDeep from 'lodash/cloneDeep'
import {ArenaService} from "./arena.service";


@Injectable({
  providedIn: 'root'
})
export class CircleService {
  circleSize: number = 1;
  circleRad: number = this.circleSize/2;
  private circleChangedSubject: Subject<Circle> = new Subject<Circle>();
  circleChanged$: Observable<Circle> = this.circleChangedSubject.asObservable();
  circleList: Circle[] = [];
  private tempCircleList: Circle[] = [];

  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  soundService : SoundService;
  notes: string[] = [];
  alterations: string[] = [];
  octaves: string[] = [];
  highestId: number = 0;
  private circleListSubject = new BehaviorSubject<Circle[]>([]);
  circleList$: Observable<Circle[]> = this.circleListSubject.asObservable();
  selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  constructor(soundService : SoundService,
              private arenaService: ArenaService) {
    this.selectedCircle = null;
    this.soundService = soundService;
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

  getNewId(): number {
    return this.highestId++;
  }

  addCircleToActiveArena(circle: Circle) {
    this.circleList.push(circle);
    this.circleListSubject.next(this.circleList);
    this.arenaService.addCircleToActiveArena(circle);
  }

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
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
}
