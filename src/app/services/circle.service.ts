import {Injectable} from '@angular/core';
import {Circle} from "../models/circle";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CircleService {

  circleList: Circle[] = [];
  colors = ["red", "green", "blue", "yellow", "pink", "orange", "purple", "cyan", "magenta", "brown"];
  selectedCircle: Circle | null;
  constructor() {
    this.selectedCircle = null;
  }

  getFromMouse(pos: number, squareUnit: number, squareSize: number): number {
    return pos * squareUnit / squareSize;
  }

  updatePos(circle: any, x: number, y: number) {
    circle.x = x;
    circle.y = y;
  }

  bounceX(circle: any, leftBorder: Boolean, squareSize: number) {
    circle.xSpeed = -circle.xSpeed;
    if(leftBorder) {
      circle.x = -circle.x;
    } else {
      circle.x = squareSize - (circle.x - squareSize);
    }
  }

  bounceY(circle: any, topBorder: Boolean, squareSize: number) {
    circle.ySpeed = -circle.ySpeed;
    if(topBorder) {
      circle.y = -circle.y;
    } else {
      circle.y = squareSize - (circle.y - squareSize);
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

  addCircle(x: number, y: number) {
    const circle: Circle = {
      id: this.circleList.length, // Assuming unique ids based on list length
      x: x,
      y: y,
      xSpeed: this.getRandomSpeed(),
      ySpeed: this.getRandomSpeed(),
      color: this.getRandomColor()
    };

    this.circleList.push(circle);
  }

  private selectedCircleSubject = new BehaviorSubject<Circle | null>(null);
  selectedCircle$ = this.selectedCircleSubject.asObservable();

  setSelectedCircle(circle: Circle) {
    this.selectedCircleSubject.next(circle);
  }
}
