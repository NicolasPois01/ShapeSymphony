import { Injectable } from '@angular/core';
import { Circle } from "../models/circle";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SoundService } from "./sound.service";
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class CircleService {
  circleSize: number = 1;
  circleRad: number = this.circleSize / 2;
  circleChangedSubject: Subject<Circle> = new Subject<Circle>();
  circleChanged$: Observable<Circle> = this.circleChangedSubject.asObservable();
  circleDeletedSubject: Subject<Circle> = new Subject<Circle>();
  circleDeleted$: Observable<Circle> = this.circleDeletedSubject.asObservable();
  circleNewWaitingSubject: Subject<Circle> = new Subject<Circle>();
  circleNewWaiting$ = this.circleNewWaitingSubject.asObservable();
  circleNewAliveSubject: Subject<Circle> = new Subject<Circle>();
  circleNewAlive$ = this.circleNewAliveSubject.asObservable();
  circleNewDeadSubject: Subject<Circle> = new Subject<Circle>();
  circleNewDead$ = this.circleNewDeadSubject.asObservable();
  circleMovedToWaitingSubject: Subject<Circle> = new Subject<Circle>();
  circleMovedToWaiting$ = this.circleMovedToWaitingSubject.asObservable();
  circleMovedToAliveSubject: Subject<Circle> = new Subject<Circle>();
  circleMovedToAlive$ = this.circleMovedToAliveSubject.asObservable();
  circleMovedToDeadSubject: Subject<Circle> = new Subject<Circle>();
  circleMovedToDead$ = this.circleMovedToDeadSubject.asObservable();
  circleListWaitingSubject = new BehaviorSubject<Circle[]>([]);
  circleListWaiting$: Observable<Circle[]> = this.circleListWaitingSubject.asObservable();
  circleListAliveSubject = new BehaviorSubject<Circle[]>([]);
  circleListAlive$: Observable<Circle[]> = this.circleListAliveSubject.asObservable();
  circleListDeadSubject = new BehaviorSubject<Circle[]>([]);
  circleListDead$: Observable<Circle[]> = this.circleListDeadSubject.asObservable();
  private collisionSubject = new Subject<any>();
  public collision$ = this.collisionSubject.asObservable();

  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  soundService: SoundService;
  notes: string[] = [];
  alterations: string[] = [];
  octaves: string[] = [];
  highestId: number = 0;
  circleListSubject = new BehaviorSubject<Circle[]>([]);
  circleList$: Observable<Circle[]> = this.circleListSubject.asObservable();
  selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();
  exportWavCircleSubject = new BehaviorSubject<any[] | null>(null);
  exportWavCircle$ = this.exportWavCircleSubject.asObservable();
  constructor(soundService: SoundService, timerService: TimerService) {
    this.selectedCircle = null;
    this.soundService = soundService;
    this.notes = this.soundService.notes;
    this.alterations = this.soundService.alterations;
    this.octaves = this.soundService.octaves;
  }

  getFromMouse(pos: number, squareUnit: number, squareSize: number): number {
    let ret: number = (pos * squareUnit / squareSize) - squareUnit / 2;
    if (ret > squareUnit / 2 - this.circleRad) ret = squareUnit / 2 - this.circleRad;
    else if (ret < -(squareUnit / 2 - this.circleRad)) ret = -(squareUnit / 2 - this.circleRad);
    return ret;
  }

  inRange(pos: number, squareUnit: number): boolean {
    return pos + (squareUnit / 2) >= this.circleRad && pos <= (squareUnit / 2) - this.circleRad;
  }

  clearAllCircles(): void {
    let circleList = [...this.circleListAliveSubject.getValue(), ...this.circleListWaitingSubject.getValue(), ...this.circleListDeadSubject.getValue()];
    while (circleList.length > 0) {
      this.deleteCircle(circleList[0]);
    }
  }

  updatePos(circle: any, x: number, y: number) {
    circle.x = x;
    circle.y = y;
    this.circleChangedSubject.next(circle);
  }

  calculatePos(elapsedTime: number, time: number, circle: Circle, squareUnit: number, isArenaMuted: boolean, midSquareSize: number, exportMP3Active: boolean = false) {

    if (circle.spawnTime > time) return;

    // Update the circle's position based on its speed and elapsed time
    circle.x += circle.xSpeed * elapsedTime;
    circle.y += circle.ySpeed * elapsedTime;

    this.updatePos(circle, circle.x, circle.y);

    let inRangeX = this.inRange(circle.x, squareUnit);
    let inRangeY = this.inRange(circle.y, squareUnit);
    // Collides x and y
    if (!inRangeX && !inRangeY) {
      circle.isColliding = true;
      circle.nbBounces++;
      let adjustedX = circle.xSpeed > 0 ? circle.x + this.circleRad : circle.x - this.circleRad;
      let adjustedY = circle.ySpeed > 0 ? circle.y + this.circleRad : circle.y - this.circleRad;
      circle.contactPoint = { x: adjustedX, y: adjustedY };
      this.collisionSubject.next({ circle, point: circle.contactPoint });

      this.bounceXY(circle, circle.xSpeed < 0, circle.ySpeed < 0, midSquareSize, isArenaMuted);
      if (exportMP3Active) this.exportWavCircleSubject.next([circle, time]);

      setTimeout(() => {
        circle.isColliding = false;
      }, 500);
    } else if (!inRangeX) { // Collides x
      circle.isColliding = true;
      circle.nbBounces++;
      let adjustedX = circle.xSpeed > 0 ? circle.x + this.circleRad : circle.x - this.circleRad;
      circle.contactPoint = { x: adjustedX, y: circle.y };
      this.collisionSubject.next({ circle, point: circle.contactPoint });
      this.bounceX(circle, circle.xSpeed < 0, midSquareSize, isArenaMuted)
      if (exportMP3Active) this.exportWavCircleSubject.next([circle, time]);

      setTimeout(() => {
        circle.isColliding = false;
      }, 500);
    } else if (!inRangeY) { // Collides y
      circle.isColliding = true;
      circle.nbBounces++;
      let adjustedY = circle.ySpeed > 0 ? circle.y + this.circleRad : circle.y - this.circleRad;
      circle.contactPoint = { x: circle.x, y: adjustedY };
      this.collisionSubject.next({ circle, point: circle.contactPoint });

      this.bounceY(circle, circle.ySpeed < 0, midSquareSize, isArenaMuted);
      if (exportMP3Active) this.exportWavCircleSubject.next([circle, time]);

      setTimeout(() => {
        circle.isColliding = false;
      }, 500);
    }
    if (circle.maxBounces != 0 && circle.nbBounces >= circle.maxBounces) {
      this.moveCircleToDeadList(circle);
      return;
    }

    this.circleChangedSubject.next(circle);
  }

  bounceX(circle: any, leftBorder: Boolean, midSquareSize: number, isArenaMuted: boolean) {
    if (!isArenaMuted) {
      this.soundService.playAudio(circle);
    }
    circle.xSpeed = -circle.xSpeed;
    if (leftBorder) {
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
    if (topBorder) {
      circle.y = -(midSquareSize + (circle.y + midSquareSize));
    } else {
      circle.y = midSquareSize - (circle.y - midSquareSize);
    }
  }

  bounceXY(circle: any, leftBorder: Boolean, topBorder: Boolean, midSquareSize: number, isArenaMuted: boolean) {
    if (!isArenaMuted) {
      this.soundService.playAudio(circle);
    }
    circle.xSpeed = -circle.xSpeed;
    circle.ySpeed = -circle.ySpeed;
    if (leftBorder) {
      circle.x = -(midSquareSize + (circle.x + midSquareSize));
    } else {
      circle.x = midSquareSize - (circle.x - midSquareSize);
    }
    if (topBorder) {
      circle.y = -(midSquareSize + (circle.y + midSquareSize));
    } else {
      circle.y = midSquareSize - (circle.y - midSquareSize);
    }
  }

  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  addCircleToWaitingList(circle: Circle) {
    let circleList = this.circleListWaitingSubject.getValue();
    circleList.push(circle);
    this.circleListWaitingSubject.next(circleList);
    this.circleNewWaitingSubject.next(circle);
  }

  addCircleToAliveList(circle: Circle) {
    let circleList = this.circleListAliveSubject.getValue();
    circleList.push(circle);
    this.circleListAliveSubject.next(circleList);
    this.circleNewAliveSubject.next(circle);
  }

  addCircleToDeadList(circle: Circle) {
    let circleList = this.circleListDeadSubject.getValue();
    circleList.push(circle);
    this.circleListDeadSubject.next(circleList);
    this.circleNewDeadSubject.next(circle);
  }

  moveCircleToAliveList(circle: Circle) {
    this.circleMovedToAliveSubject.next(circle);
  }

  setSelectedCircle(circle: Circle | null = null) {
    this.selectedCircleSubject.next(circle);
    this.selectedCircle = this.selectedCircleSubject.getValue();
  }

  deleteCircle(circle: Circle): void {
    let circleListWaiting = this.circleListWaitingSubject.getValue();
    let circleListAlive = this.circleListAliveSubject.getValue();
    let circleListDead = this.circleListDeadSubject.getValue();
    const index = circleListWaiting.findIndex(c => c.id === circle.id);
    if (index > -1) {
      circleListWaiting.splice(index, 1);
      this.circleListWaitingSubject.next(circleListWaiting);  // Notifier le changement
      this.circleDeletedSubject.next(circle);
    } else {
      const index = circleListAlive.findIndex(c => c.id === circle.id);
      if (index > -1) {
        circleListAlive.splice(index, 1);
        this.circleListAliveSubject.next(circleListAlive);  // Notifier le changement
        this.circleDeletedSubject.next(circle);
      } else {
        const index = circleListDead.findIndex(c => c.id === circle.id);
        if (index > -1) {
          circleListDead.splice(index, 1);
          this.circleListDeadSubject.next(circleListDead);  // Notifier le changement
          this.circleDeletedSubject.next(circle);
        }
      }
    }
  }

  moveCircleToWaitingList(circle: Circle) {
    this.circleMovedToWaitingSubject.next(circle);
  }

  moveCircleToDeadList(circle: Circle) {
    this.circleMovedToDeadSubject.next(circle);
  }

  setCircleListAlive(circleList: Circle[]) {
    this.circleListAliveSubject.next(circleList);
    this.highestId = Math.max(...[...this.circleListWaitingSubject.getValue(), ...this.circleListAliveSubject.getValue(), ...this.circleListDeadSubject.getValue()].map(circle => circle.id)) + 1;
  }

  setCircleListWaiting(circleList: Circle[]) {
    this.circleListWaitingSubject.next(circleList);
    this.highestId = Math.max(...[...this.circleListWaitingSubject.getValue(), ...this.circleListAliveSubject.getValue(), ...this.circleListDeadSubject.getValue()].map(circle => circle.id)) + 1;
  }

  setCircleListDead(circleList: Circle[]) {
    this.circleListDeadSubject.next(circleList);
    this.highestId = Math.max(...[...this.circleListWaitingSubject.getValue(), ...this.circleListAliveSubject.getValue(), ...this.circleListDeadSubject.getValue()].map(circle => circle.id)) + 1;
  }

  setColor(color: string | undefined) {
    if (this.selectedCircle) {
      if (color != null) {
        this.selectedCircle.color = color;
      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  async setNote(note: string | undefined) {
    if (this.selectedCircle) {
      if (note != null) {
        this.selectedCircle.note = note;
        this.selectedCircle.audio = await this.modifyNote(this.selectedCircle, note, this.selectedCircle.alteration, this.selectedCircle.octave);
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

  updateSpawnTime(circle: Circle) {
    if (this.selectedCircle) {
      this.selectedCircle.spawnTime = circle.spawnTime;
      this.selectedCircleSubject.next(circle);
    }
  }

  updateCircleSpeed(circle: Circle) {
    if (this.selectedCircle) {
      circle.startXSpeed = circle.xSpeed;
      circle.startYSpeed = circle.ySpeed;
      this.selectedCircleSubject.next(circle);
    }
  }

  async setAlteration(alteration: string | undefined) {
    if (this.selectedCircle) {
      if (alteration != null) {
        this.selectedCircle.alteration = alteration;
        this.selectedCircle.audio = await this.modifyNote(this.selectedCircle, this.selectedCircle.note, alteration, this.selectedCircle.octave);

      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  async setOctave(octave: number | undefined) {
    if (this.selectedCircle) {
      if (octave != null) {
        this.selectedCircle.octave = octave;
        this.selectedCircle.audio = await this.modifyNote(this.selectedCircle, this.selectedCircle.note, this.selectedCircle.alteration, octave);

      }
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  setSpawnTime(spawnTime: number) {
    if (this.selectedCircle) {
      this.selectedCircle.spawnTime = spawnTime;
      this.circleChangedSubject.next(this.selectedCircle);
    }
  }

  getNewId(): number {
    return this.highestId++;
  }

  async modifyNote(
    circle: Circle,
    newNote: string,
    newAlteration: string,
    newOctave: number
  ): Promise<HTMLAudioElement> {
    const instrument = circle.instrument;

    let alteration = newAlteration !== undefined ? newAlteration : circle.alteration;
    let octave = newOctave !== undefined ? newOctave : circle.octave;

    if (newNote === "Do" && alteration === "b") {
      circle.note = "Si";
      circle.alteration = "";
      circle.octave -= 1;
    } else if (newNote === "Mi" && alteration === "d") {
      circle.note = "Fa";
      circle.alteration = "";
    } else if (newNote === "Fa" && alteration === "b") {
      circle.note = "Mi";
      circle.alteration = "";
    } else if (newNote === "Si" && alteration === "d") {
      circle.note = "Do";
      circle.alteration = "";
      circle.octave += 1;
    }

    const newAudioFileName = `${instrument}${circle.note}${circle.alteration}${circle.octave}.mp3`;
    const newAudioFilePath = `./assets/samples/${instrument}/${newAudioFileName}`;

    const response = await fetch(newAudioFilePath, { method: 'HEAD' });
    let newAudio = new Audio();
    if (response.ok) {
      newAudio = new Audio(newAudioFilePath);
      newAudio.preload = "auto";
      newAudio.volume = circle.volume / 100;
      newAudio.load();
    }
    this.circleChangedSubject.next(circle);
    return newAudio;
  }



}
